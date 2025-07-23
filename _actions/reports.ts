"use server";

import { db } from "@/database";
import {
  alternatif,
  kriteria,
  subKriteria,
  penilaian,
  hasilPerhitungan,
} from "@/database/schema";
import { eq } from "drizzle-orm";

export type ReportsFormState = {
  success?: boolean;
  error?: string;
  data?: any;
};

export async function getAlternatifReport(): Promise<ReportsFormState> {
  try {
    const data = await db.select().from(alternatif).orderBy(alternatif.kode);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching alternatif report:", error);
    return { success: false, error: "Failed to fetch alternatif data" };
  }
}

export async function getKriteriaReport(): Promise<ReportsFormState> {
  try {
    const data = await db.select().from(kriteria).orderBy(kriteria.kode);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching kriteria report:", error);
    return { success: false, error: "Failed to fetch kriteria data" };
  }
}

export async function getSubKriteriaReport(): Promise<ReportsFormState> {
  try {
    const data = await db
      .select({
        id: subKriteria.id,
        nama: subKriteria.nama,
        bobot: subKriteria.bobot,
        keterangan: subKriteria.keterangan,
        kriteria_nama: kriteria.nama,
        kriteria_kode: kriteria.kode,
      })
      .from(subKriteria)
      .leftJoin(kriteria, eq(subKriteria.kriteria_id, kriteria.id))
      .orderBy(kriteria.kode, subKriteria.nama);

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching sub kriteria report:", error);
    return { success: false, error: "Failed to fetch sub kriteria data" };
  }
}

export async function getPenilaianReport(): Promise<ReportsFormState> {
  try {
    const data = await db
      .select({
        id: penilaian.id,
        nilai: penilaian.nilai,
        alternatif_kode: alternatif.kode,
        alternatif_nama: alternatif.nama,
        kriteria_kode: kriteria.kode,
        kriteria_nama: kriteria.nama,
        sub_kriteria_nama: subKriteria.nama,
        sub_kriteria_bobot: subKriteria.bobot,
      })
      .from(penilaian)
      .innerJoin(alternatif, eq(penilaian.alternatif_id, alternatif.id))
      .innerJoin(kriteria, eq(penilaian.kriteria_id, kriteria.id))
      .innerJoin(subKriteria, eq(penilaian.sub_kriteria_id, subKriteria.id))
      .orderBy(alternatif.kode, kriteria.kode);

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching penilaian report:", error);
    return { success: false, error: "Failed to fetch penilaian data" };
  }
}

export async function getHasilNilaiReport(): Promise<ReportsFormState> {
  try {
    const data = await db
      .select({
        id: hasilPerhitungan.id,
        nilai_vektor_s: hasilPerhitungan.nilai_vektor_s,
        nilai_vektor_v: hasilPerhitungan.nilai_vektor_v,
        ranking: hasilPerhitungan.ranking,
        alternatif_kode: alternatif.kode,
        alternatif_nama: alternatif.nama,
        alternatif_jenis: alternatif.jenis,
      })
      .from(hasilPerhitungan)
      .leftJoin(alternatif, eq(hasilPerhitungan.alternatif_id, alternatif.id))
      .orderBy(hasilPerhitungan.ranking);

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching hasil nilai report:", error);
    return { success: false, error: "Failed to fetch hasil nilai data" };
  }
}
