"use server";

import { db } from "@/database";
import {
  penilaian,
  alternatif,
  kriteria,
  subKriteria,
} from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type PenilaianFormState = {
  success?: boolean;
  error?: string;
  type?: "info" | "error" | "success";
};

export async function getPenilaian() {
  try {
    const data = await db
      .select({
        id: penilaian.id,
        alternatif_id: penilaian.alternatif_id,
        kriteria_id: penilaian.kriteria_id,
        sub_kriteria_id: penilaian.sub_kriteria_id,
        nilai: penilaian.nilai,
        kode_alternatif: alternatif.kode,
        nama_alternatif: alternatif.nama,
        kode_kriteria: kriteria.kode,
        nama_kriteria: kriteria.nama,
        nama_sub_kriteria: subKriteria.nama,
      })
      .from(penilaian)
      .leftJoin(alternatif, eq(penilaian.alternatif_id, alternatif.id))
      .leftJoin(kriteria, eq(penilaian.kriteria_id, kriteria.id))
      .leftJoin(subKriteria, eq(penilaian.sub_kriteria_id, subKriteria.id));

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching penilaian:", error);
    return { success: false, error: "Failed to fetch penilaian" };
  }
}

export async function createPenilaian(
  alternatif_id: number,
  kriteria_id: number,
  sub_kriteria_id: number,
  nilai: string
): Promise<PenilaianFormState> {
  try {
    const existing = await db
      .select()
      .from(penilaian)
      .where(
        and(
          eq(penilaian.alternatif_id, alternatif_id),
          eq(penilaian.kriteria_id, kriteria_id)
        )
      );

    if (existing.length > 0) {
      return {
        error: "Penilaian untuk alternatif dan kriteria ini sudah ada!",
      };
    }

    await db.insert(penilaian).values({
      alternatif_id,
      kriteria_id,
      sub_kriteria_id,
      nilai,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/data-penilaian");
    revalidatePath("/admin/data-perhitungan");

    return { success: true };
  } catch (error) {
    console.error("Error creating penilaian:", error);
    return { error: "Gagal menambahkan data penilaian!" };
  }
}

export async function deletePenilaian(id: number): Promise<PenilaianFormState> {
  try {
    await db.delete(penilaian).where(eq(penilaian.id, id));

    revalidatePath("/admin");
    revalidatePath("/admin/data-penilaian");
    revalidatePath("/admin/data-perhitungan");

    return { success: true };
  } catch (error) {
    console.error("Error deleting penilaian:", error);
    return { error: "Failed to delete penilaian" };
  }
}

export async function deletePenilaianByAlternatif(
  alternatif_id: number
): Promise<PenilaianFormState> {
  try {
    await db
      .delete(penilaian)
      .where(eq(penilaian.alternatif_id, alternatif_id));

    revalidatePath("/admin");
    revalidatePath("/admin/data-penilaian");
    revalidatePath("/admin/data-perhitungan");

    return { success: true };
  } catch (error) {
    console.error("Error deleting penilaian by alternatif:", error);
    return { error: "Failed to delete penilaian" };
  }
}

export async function createBulkPenilaian(
  alternatif_id: number,
  penilaianData: Array<{
    kriteria_id: number;
    sub_kriteria_id: number;
    nilai: string;
  }>
): Promise<PenilaianFormState> {
  try {
    await db
      .delete(penilaian)
      .where(eq(penilaian.alternatif_id, alternatif_id));

    for (const data of penilaianData) {
      await db.insert(penilaian).values({
        alternatif_id,
        kriteria_id: data.kriteria_id,
        sub_kriteria_id: data.sub_kriteria_id,
        nilai: data.nilai,
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/data-penilaian");
    revalidatePath("/admin/data-perhitungan");

    return { success: true };
  } catch (error) {
    console.error("Error creating bulk penilaian:", error);
    return { error: "Gagal menyimpan data penilaian!" };
  }
}

export async function updateBulkPenilaian(
  alternatif_id: number,
  penilaianData: Array<{
    kriteria_id: number;
    sub_kriteria_id: number;
    nilai: string;
  }>
): Promise<PenilaianFormState> {
  try {
    await db
      .delete(penilaian)
      .where(eq(penilaian.alternatif_id, alternatif_id));

    for (const data of penilaianData) {
      await db.insert(penilaian).values({
        alternatif_id,
        kriteria_id: data.kriteria_id,
        sub_kriteria_id: data.sub_kriteria_id,
        nilai: data.nilai,
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/data-penilaian");
    revalidatePath("/admin/data-perhitungan");

    return { success: true };
  } catch (error) {
    console.error("Error updating bulk penilaian:", error);
    return { error: "Gagal memperbarui data penilaian!" };
  }
}
