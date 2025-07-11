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

    // Ambil data kriteria
    const dataKriteria = await db.select().from(kriteria);

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

    const kriteriaNormalisasi: KriteriaNormalisasi[] = dataKriteria.map((k) => {
      const bobotNormal = parseFloat(k.bobot.toString()) / totalBobot;
      const bobotFinal = k.jenis === "cost" ? -bobotNormal : bobotNormal;

      return {
        id: k.id,
        kode: k.kode,
        nama: k.nama,
        bobot: parseFloat(k.bobot.toString()),
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
      kriteriaNormalisasi.forEach((krit) => {
        const nilai = alt.nilai[krit.kode] || 0;
        s *= Math.pow(nilai, krit.bobot_normal);
      });
      vektorS[alt.id] = s;
    });

    // Hitung Vektor V
    const totalS = Object.values(vektorS).reduce((sum, s) => sum + s, 0);
    const vektorV: { [key: number]: number } = {};

    Object.keys(vektorS).forEach((altId) => {
      const id = parseInt(altId);
      vektorV[id] = vektorS[id] / totalS;
    });

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
      await db.insert(hasil_perhitungan).values({
        alternatif_id: hasil.alternatif_id,
        nilai_vektor_s: hasil.nilai_vektor_s.toString(),
        nilai_vektor_v: hasil.nilai_vektor_v.toString(),
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
