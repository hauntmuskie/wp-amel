"use server";

import db from "@/database";
import { kriteria, type NewKriteria } from "@/database/schema";
import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type KriteriaFormState = {
  success?: boolean;
  error?: string;
  type?: "info" | "error" | "success";
};

export async function getKriteria() {
  try {
    const data = await db.select().from(kriteria);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching kriteria:", error);
    return { success: false, error: "Failed to fetch kriteria" };
  }
}

export async function createKriteria(
  prevState: KriteriaFormState,
  formData: FormData
): Promise<KriteriaFormState> {
  try {
    const kode = formData.get("kode");
    const nama = formData.get("nama");
    const bobot = formData.get("bobot");
    const jenis = formData.get("jenis");

    if (!kode || !nama || !bobot || !jenis) {
      return { error: "Semua field harus diisi!" };
    }

    if (
      typeof kode !== "string" ||
      typeof nama !== "string" ||
      typeof bobot !== "string" ||
      typeof jenis !== "string"
    ) {
      return { error: "Data tidak valid!" };
    }

    if (jenis !== "benefit" && jenis !== "cost") {
      return { error: "Jenis harus benefit atau cost!" };
    }

    const existing = await db
      .select()
      .from(kriteria)
      .where(or(eq(kriteria.kode, kode), eq(kriteria.nama, nama)));

    if (existing.length > 0) {
      const duplicate = existing.find((krit) => krit.kode === kode);
      if (duplicate) {
        return { error: "Kode kriteria sudah ada dalam database!" };
      }

      const duplicateName = existing.find((krit) => krit.nama === nama);
      if (duplicateName) {
        return { error: "Nama kriteria sudah ada dalam database!" };
      }
    }

    const newKriteria: NewKriteria = {
      kode,
      nama,
      bobot,
      jenis,
    };

    await db.insert(kriteria).values(newKriteria);

    revalidatePath("/admin");
    revalidatePath("/admin/data-kriteria");
    revalidatePath("/admin/data-perhitungan");

    return { success: true };
  } catch (error) {
    console.error("Error creating kriteria:", error);
    return { error: "Gagal menambahkan data kriteria!" };
  }
}

export async function updateKriteria(
  id: number,
  prevState: KriteriaFormState,
  formData: FormData
): Promise<KriteriaFormState> {
  try {
    const kode = formData.get("kode");
    const nama = formData.get("nama");
    const bobot = formData.get("bobot");
    const jenis = formData.get("jenis");

    if (!kode || !nama || !bobot || !jenis) {
      return { error: "Semua field harus diisi!" };
    }

    if (
      typeof kode !== "string" ||
      typeof nama !== "string" ||
      typeof bobot !== "string" ||
      typeof jenis !== "string"
    ) {
      return { error: "Data tidak valid!" };
    }

    if (jenis !== "benefit" && jenis !== "cost") {
      return { error: "Jenis harus benefit atau cost!" };
    }

    const existing = await db
      .select()
      .from(kriteria)
      .where(or(eq(kriteria.kode, kode), eq(kriteria.nama, nama)));

    const duplicates = existing.filter((krit) => krit.id !== id);

    if (duplicates.length > 0) {
      const duplicate = duplicates.find((krit) => krit.kode === kode);
      if (duplicate) {
        return { error: "Kode kriteria sudah ada dalam database!" };
      }

      const duplicateName = duplicates.find((krit) => krit.nama === nama);
      if (duplicateName) {
        return { error: "Nama kriteria sudah ada dalam database!" };
      }
    }

    const current = await db.select().from(kriteria).where(eq(kriteria.id, id));

    if (current.length > 0) {
      const currentData = current[0];
      if (
        currentData.kode === kode &&
        currentData.nama === nama &&
        currentData.bobot === bobot &&
        currentData.jenis === jenis
      ) {
        return { error: "Data tidak ada perubahan!", type: "info" };
      }
    }

    const updateData: Partial<NewKriteria> = { kode, nama, bobot, jenis };

    await db.update(kriteria).set(updateData).where(eq(kriteria.id, id));

    revalidatePath("/admin");
    revalidatePath("/admin/data-kriteria");
    revalidatePath("/admin/data-perhitungan");

    return { success: true };
  } catch (error) {
    console.error("Error updating kriteria:", error);
    return { error: "Gagal memperbarui data kriteria!" };
  }
}

export async function deleteKriteria(id: number): Promise<KriteriaFormState> {
  try {
    await db.delete(kriteria).where(eq(kriteria.id, id));

    revalidatePath("/admin");
    revalidatePath("/admin/data-kriteria");
    revalidatePath("/admin/data-perhitungan");

    return { success: true };
  } catch (error) {
    console.error("Error deleting kriteria:", error);
    return { error: "Failed to delete kriteria" };
  }
}
