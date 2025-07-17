"use server";

import db from "@/database";
import { alternatif } from "@/database/schema";
import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type AlternatifFormState = {
  success?: boolean;
  error?: string;
  type?: "info" | "error" | "success";
};

export async function getAlternatif() {
  try {
    const data = await db.select().from(alternatif);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching alternatif:", error);
    return { success: false, error: "Failed to fetch alternatif" };
  }
}

export async function createAlternatif(
  prevState: AlternatifFormState,
  formData: FormData
): Promise<AlternatifFormState> {
  try {
    const kode = formData.get("kode") as string;
    const nama = formData.get("nama") as string;
    const jenis = formData.get("jenis") as "Interior" | "Eksterior";

    if (!kode || !nama || !jenis) {
      return { error: "Semua field harus diisi!" };
    }

    const existing = await db
      .select()
      .from(alternatif)
      .where(or(eq(alternatif.kode, kode), eq(alternatif.nama, nama)));

    if (existing.length > 0) {
      const duplicate = existing.find((alt) => alt.kode === kode);
      if (duplicate) {
        return { error: "Kode alternatif sudah ada dalam database!" };
      }

      const duplicateName = existing.find((alt) => alt.nama === nama);
      if (duplicateName) {
        return { error: "Nama alternatif sudah ada dalam database!" };
      }
    }

    await db.insert(alternatif).values({
      kode,
      nama,
      jenis,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/data-alternatif");
    revalidatePath("/admin/data-penilaian");
    revalidatePath("/admin/data-perhitungan");

    return { success: true };
  } catch (error) {
    console.error("Error creating alternatif:", error);
    return { error: "Gagal menambahkan data alternatif!" };
  }
}

export async function updateAlternatif(
  id: number,
  prevState: AlternatifFormState,
  formData: FormData
): Promise<AlternatifFormState> {
  try {
    const kode = formData.get("kode") as string;
    const nama = formData.get("nama") as string;
    const jenis = formData.get("jenis") as "Interior" | "Eksterior";

    if (!kode || !nama || !jenis) {
      return { error: "Semua field harus diisi!" };
    }

    const existing = await db
      .select()
      .from(alternatif)
      .where(or(eq(alternatif.kode, kode), eq(alternatif.nama, nama)));

    const duplicates = existing.filter((alt) => alt.id !== id);

    if (duplicates.length > 0) {
      const duplicate = duplicates.find((alt) => alt.kode === kode);
      if (duplicate) {
        return { error: "Kode alternatif sudah ada dalam database!" };
      }

      const duplicateName = duplicates.find((alt) => alt.nama === nama);
      if (duplicateName) {
        return { error: "Nama alternatif sudah ada dalam database!" };
      }
    }

    const current = await db
      .select()
      .from(alternatif)
      .where(eq(alternatif.id, id));

    if (current.length > 0) {
      const currentData = current[0];
      if (
        currentData.kode === kode &&
        currentData.nama === nama &&
        currentData.jenis === jenis
      ) {
        return { error: "Data tidak ada perubahan!", type: "info" };
      }
    }

    await db
      .update(alternatif)
      .set({ kode, nama, jenis })
      .where(eq(alternatif.id, id));

    revalidatePath("/admin");
    revalidatePath("/admin/data-alternatif");
    revalidatePath("/admin/data-penilaian");
    revalidatePath("/admin/data-perhitungan");

    return { success: true };
  } catch (error) {
    console.error("Error updating alternatif:", error);
    return { error: "Gagal memperbarui data alternatif!" };
  }
}

export async function deleteAlternatif(
  id: number
): Promise<AlternatifFormState> {
  try {
    await db.delete(alternatif).where(eq(alternatif.id, id));

    revalidatePath("/admin");
    revalidatePath("/admin/data-alternatif");
    revalidatePath("/admin/data-penilaian");
    revalidatePath("/admin/data-perhitungan");

    return { success: true };
  } catch (error) {
    console.error("Error deleting alternatif:", error);
    return { error: "Failed to delete alternatif" };
  }
}
