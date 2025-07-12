import { NextResponse } from "next/server";
import { db } from "@/database";
import {
  alternatif,
  kriteria,
  penilaian,
  hasil_perhitungan,
  normalisasi_bobot,
} from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface AlternatifNilai {
  id: number;
  kode: string;
  nama: string;
  nilai: { [key: string]: number };
}

interface KriteriaNormalisasi {
  id: number;
  kode: string;
  nama: string;
  bobot: number;
  jenis: string;
  bobot_normal: number;
}

export async function POST() {
  try {
    // Ambil data alternatif
    const dataAlternatif = await db.select().from(alternatif);
    if (dataAlternatif.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data alternatif" },
        { status: 400 }
      );
    }

    // Ambil data kriteria
    const dataKriteria = await db.select().from(kriteria);
    if (dataKriteria.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data kriteria" },
        { status: 400 }
      );
    }

    // Ambil data penilaian
    const dataPenilaian = await db
      .select({
        alternatif_id: penilaian.alternatif_id,
        kriteria_id: penilaian.kriteria_id,
        nilai: penilaian.nilai,
        kode_kriteria: kriteria.kode,
      })
      .from(penilaian)
      .leftJoin(kriteria, eq(penilaian.kriteria_id, kriteria.id));

    if (dataPenilaian.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data penilaian" },
        { status: 400 }
      );
    }

    // Validate that we have complete data
    const expectedPenilaianCount = dataAlternatif.length * dataKriteria.length;
    if (dataPenilaian.length < expectedPenilaianCount) {
      return NextResponse.json(
        { error: `Data penilaian tidak lengkap. Diperlukan ${expectedPenilaianCount} data, tersedia ${dataPenilaian.length}` },
        { status: 400 }
      );
    }

    // Susun data alternatif dengan nilai kriteria
    const alternatifNilai: AlternatifNilai[] = dataAlternatif.map((alt) => {
      const nilai: { [key: string]: number } = {};

      dataPenilaian.forEach((pen) => {
        if (pen.alternatif_id === alt.id && pen.kode_kriteria) {
          nilai[pen.kode_kriteria] = parseFloat(pen.nilai?.toString() || "0");
        }
      });

      return {
        id: alt.id,
        kode: alt.kode,
        nama: alt.nama,
        nilai,
      };
    });

    // Hitung normalisasi bobot
    const totalBobot = dataKriteria.reduce(
      (sum, k) => sum + parseFloat(k.bobot.toString()),
      0
    );

    if (totalBobot <= 0) {
      return NextResponse.json(
        { error: "Total bobot kriteria harus lebih besar dari 0" },
        { status: 400 }
      );
    }

    const kriteriaNormalisasi: KriteriaNormalisasi[] = dataKriteria.map((k) => {
      const bobotValue = parseFloat(k.bobot.toString());
      const bobotNormal = bobotValue / totalBobot;
      const bobotFinal = k.jenis === "cost" ? -bobotNormal : bobotNormal;

      return {
        id: k.id,
        kode: k.kode,
        nama: k.nama,
        bobot: bobotValue,
        jenis: k.jenis,
        bobot_normal: bobotFinal,
      };
    });

    // Simpan normalisasi bobot ke database
    // Hapus data lama dan insert yang baru
    await db.delete(normalisasi_bobot);

    for (const kn of kriteriaNormalisasi) {
      await db.insert(normalisasi_bobot).values({
        kriteria_id: kn.id,
        bobot_awal: kn.bobot.toString(),
        bobot_normal: kn.bobot_normal.toString(),
      });
    }

    // Hitung Vektor S
    const vektorS: { [key: number]: number } = {};

    alternatifNilai.forEach((alt) => {
      let s = 1;
      console.log(`Calculating S for ${alt.nama}:`, alt.nilai);
      
      kriteriaNormalisasi.forEach((krit) => {
        const nilai = alt.nilai[krit.kode] || 0;
        console.log(`  ${krit.kode}: nilai=${nilai}, bobot_normal=${krit.bobot_normal}`);
        
        // Avoid division by zero and invalid calculations
        if (nilai > 0 && !isNaN(krit.bobot_normal) && isFinite(krit.bobot_normal)) {
          const power = Math.pow(nilai, krit.bobot_normal);
          console.log(`    Math.pow(${nilai}, ${krit.bobot_normal}) = ${power}`);
          s *= power;
        }
      });
      
      // Ensure S is a valid number
      const finalS = isNaN(s) || !isFinite(s) ? 0 : s;
      vektorS[alt.id] = finalS;
      console.log(`  Final S for ${alt.nama}: ${finalS}`);
    });

    console.log("All Vektor S values:", vektorS);

    // Hitung Vektor V
    const totalS = Object.values(vektorS).reduce((sum, s) => sum + s, 0);
    console.log("Total S:", totalS);
    const vektorV: { [key: number]: number } = {};

    // Avoid division by zero
    if (totalS > 0) {
      Object.keys(vektorS).forEach((altId) => {
        const id = parseInt(altId);
        const nilai = vektorS[id] / totalS;
        console.log(`Vektor V for alt ${id}: ${vektorS[id]} / ${totalS} = ${nilai}`);
        vektorV[id] = isNaN(nilai) || !isFinite(nilai) ? 0 : nilai;
      });
    } else {
      console.log("Total S is zero, setting all V values to 0");
      // If totalS is 0, set all V values to 0
      Object.keys(vektorS).forEach((altId) => {
        const id = parseInt(altId);
        vektorV[id] = 0;
      });
    }

    console.log("All Vektor V values:", vektorV);

    // Buat ranking
    const ranking = Object.entries(vektorV)
      .sort(([, a], [, b]) => b - a)
      .map(([altId, nilai], index) => ({
        alternatif_id: parseInt(altId),
        nilai_vektor_s: vektorS[parseInt(altId)],
        nilai_vektor_v: nilai,
        ranking: index + 1,
      }));

    // Simpan hasil perhitungan ke database
    // Hapus hasil sebelumnya
    await db.delete(hasil_perhitungan);

    // Insert hasil baru
    for (const hasil of ranking) {
      // Validate values before inserting
      const nilaiS = isNaN(hasil.nilai_vektor_s) || !isFinite(hasil.nilai_vektor_s) ? 0 : hasil.nilai_vektor_s;
      const nilaiV = isNaN(hasil.nilai_vektor_v) || !isFinite(hasil.nilai_vektor_v) ? 0 : hasil.nilai_vektor_v;
      
      console.log(`Inserting for alternatif ${hasil.alternatif_id}:`, {
        nilaiS: nilaiS.toString(),
        nilaiV: nilaiV.toString(),
        ranking: hasil.ranking
      });
      
      await db.insert(hasil_perhitungan).values({
        alternatif_id: hasil.alternatif_id,
        nilai_vektor_s: nilaiS.toString(),
        nilai_vektor_v: nilaiV.toString(),
        ranking: hasil.ranking,
      });
    }

    // Ambil data hasil lengkap dengan nama alternatif
    const hasilLengkap = await db
      .select({
        id: hasil_perhitungan.id,
        alternatif_id: hasil_perhitungan.alternatif_id,
        kode_alternatif: alternatif.kode,
        nama_alternatif: alternatif.nama,
        nilai_vektor_s: hasil_perhitungan.nilai_vektor_s,
        nilai_vektor_v: hasil_perhitungan.nilai_vektor_v,
        ranking: hasil_perhitungan.ranking,
      })
      .from(hasil_perhitungan)
      .leftJoin(alternatif, eq(hasil_perhitungan.alternatif_id, alternatif.id))
      .orderBy(hasil_perhitungan.ranking);

    // Revalidate related paths
    revalidatePath("/admin");
    revalidatePath("/admin/data-hasil-nilai");

    return NextResponse.json({
      success: true,
      normalisasi_bobot: kriteriaNormalisasi,
      hasil_perhitungan: hasilLengkap,
      data_input: {
        alternatif: alternatifNilai,
        kriteria: kriteriaNormalisasi,
      },
    });
  } catch (error) {
    console.error("Error in WP calculation:", error);
    return NextResponse.json(
      { error: "Failed to calculate Weighted Product" },
      { status: 500 }
    );
  }
}
