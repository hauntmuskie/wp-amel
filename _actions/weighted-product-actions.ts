"use server";

import { db } from "@/database";
import {
  alternatif,
  kriteria,
  penilaian,
  hasilPerhitungan,
  normalisasiBobot,
} from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type WeightedProductState = {
  success?: boolean;
  error?: string;
  data?: any;
};

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

export async function calculateWeightedProduct(): Promise<WeightedProductState> {
  try {
    const dataAlternatif = await db.select().from(alternatif);
    if (dataAlternatif.length === 0) {
      return { error: "Tidak ada data alternatif" };
    }

    const dataKriteria = await db.select().from(kriteria);
    if (dataKriteria.length === 0) {
      return { error: "Tidak ada data kriteria" };
    }

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
      return { error: "Tidak ada data penilaian" };
    }

    const expectedPenilaianCount = dataAlternatif.length * dataKriteria.length;
    if (dataPenilaian.length < expectedPenilaianCount) {
      return {
        error: `Data penilaian tidak lengkap. Diperlukan ${expectedPenilaianCount} data, tersedia ${dataPenilaian.length}`,
      };
    }

    const alternatifNilai: AlternatifNilai[] = dataAlternatif.map((alt) => {
      const nilai: { [key: string]: number } = {};

      dataPenilaian.forEach((pen) => {
        if (pen.alternatif_id === alt.id && pen.kode_kriteria) {
          nilai[pen.kode_kriteria] = Number.parseFloat(
            pen.nilai?.toString() || "0"
          );
        }
      });

      return {
        id: alt.id,
        kode: alt.kode,
        nama: alt.nama,
        nilai,
      };
    });

    const totalBobot = dataKriteria.reduce(
      (sum, k) => sum + Number.parseFloat(k.bobot.toString()),
      0
    );

    if (totalBobot <= 0) {
      return { error: "Total bobot kriteria harus lebih besar dari 0" };
    }

    const kriteriaNormalisasi: KriteriaNormalisasi[] = dataKriteria.map((k) => {
      const bobotValue = Number.parseFloat(k.bobot.toString());
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

    await db.delete(normalisasiBobot);

    for (const kn of kriteriaNormalisasi) {
      await db.insert(normalisasiBobot).values({
        kriteria_id: kn.id,
        bobot_awal: kn.bobot.toString(),
        bobot_normal: kn.bobot_normal.toString(),
      });
    }

    const vektorS: { [key: number]: number } = {};

    alternatifNilai.forEach((alt) => {
      let s = 1;

      kriteriaNormalisasi.forEach((krit) => {
        const nilai = alt.nilai[krit.kode] || 0;

        if (
          nilai > 0 &&
          !isNaN(krit.bobot_normal) &&
          isFinite(krit.bobot_normal)
        ) {
          const power = Math.pow(nilai, krit.bobot_normal);
          s *= power;
        }
      });

      const finalS = isNaN(s) || !isFinite(s) ? 0 : s;
      vektorS[alt.id] = finalS;
    });

    const totalS = Object.values(vektorS).reduce((sum, s) => sum + s, 0);
    const vektorV: { [key: number]: number } = {};

    if (totalS > 0) {
      Object.keys(vektorS).forEach((altId) => {
        const id = Number.parseInt(altId);
        const nilai = vektorS[id] / totalS;
        vektorV[id] = isNaN(nilai) || !isFinite(nilai) ? 0 : nilai;
      });
    } else {
      Object.keys(vektorS).forEach((altId) => {
        const id = Number.parseInt(altId);
        vektorV[id] = 0;
      });
    }

    const ranking = Object.entries(vektorV)
      .sort(([, a], [, b]) => b - a)
      .map(([altId, nilai], index) => ({
        alternatif_id: Number.parseInt(altId),
        nilai_vektor_s: vektorS[Number.parseInt(altId)],
        nilai_vektor_v: nilai,
        ranking: index + 1,
      }));

    await db.delete(hasilPerhitungan);

    for (const hasil of ranking) {
      const nilaiS =
        isNaN(hasil.nilai_vektor_s) || !isFinite(hasil.nilai_vektor_s)
          ? 0
          : hasil.nilai_vektor_s;
      const nilaiV =
        isNaN(hasil.nilai_vektor_v) || !isFinite(hasil.nilai_vektor_v)
          ? 0
          : hasil.nilai_vektor_v;

      await db.insert(hasilPerhitungan).values({
        alternatif_id: hasil.alternatif_id,
        nilai_vektor_s: nilaiS.toString(),
        nilai_vektor_v: nilaiV.toString(),
        ranking: hasil.ranking,
      });
    }

    const hasilLengkap = await db
      .select({
        id: hasilPerhitungan.id,
        alternatif_id: hasilPerhitungan.alternatif_id,
        kode_alternatif: alternatif.kode,
        nama_alternatif: alternatif.nama,
        nilai_vektor_s: hasilPerhitungan.nilai_vektor_s,
        nilai_vektor_v: hasilPerhitungan.nilai_vektor_v,
        ranking: hasilPerhitungan.ranking,
      })
      .from(hasilPerhitungan)
      .leftJoin(alternatif, eq(hasilPerhitungan.alternatif_id, alternatif.id))
      .orderBy(hasilPerhitungan.ranking);

    revalidatePath("/admin");
    revalidatePath("/admin/data-perhitungan");

    return {
      success: true,
      data: {
        normalisasiBobot: kriteriaNormalisasi,
        hasilPerhitungan: hasilLengkap,
        data_input: {
          alternatif: alternatifNilai,
          kriteria: kriteriaNormalisasi,
        },
      },
    };
  } catch (error) {
    console.error("Error in WP calculation:", error);
    return { error: "Failed to calculate Weighted Product" };
  }
}

export async function getWeightedProductResults() {
  try {
    const hasilData = await db
      .select({
        id: hasilPerhitungan.id,
        alternatif_id: hasilPerhitungan.alternatif_id,
        kode_alternatif: alternatif.kode,
        nama_alternatif: alternatif.nama,
        nilai_vektor_s: hasilPerhitungan.nilai_vektor_s,
        nilai_vektor_v: hasilPerhitungan.nilai_vektor_v,
        ranking: hasilPerhitungan.ranking,
      })
      .from(hasilPerhitungan)
      .leftJoin(alternatif, eq(hasilPerhitungan.alternatif_id, alternatif.id))
      .orderBy(hasilPerhitungan.ranking);

    const normalisasiData = await db
      .select({
        id: normalisasiBobot.id,
        kriteria_id: normalisasiBobot.kriteria_id,
        kode_kriteria: kriteria.kode,
        nama_kriteria: kriteria.nama,
        jenis_kriteria: kriteria.jenis,
        bobot_awal: normalisasiBobot.bobot_awal,
        bobot_normal: normalisasiBobot.bobot_normal,
      })
      .from(normalisasiBobot)
      .leftJoin(kriteria, eq(normalisasiBobot.kriteria_id, kriteria.id));

    return {
      success: true,
      data: {
        hasilPerhitungan: hasilData,
        normalisasiBobot: normalisasiData,
      },
    };
  } catch (error) {
    console.error("Error fetching results:", error);
    return { success: false, error: "Failed to fetch results" };
  }
}
