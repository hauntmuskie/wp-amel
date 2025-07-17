"use server";

import db from "@/database";
import { subKriteria, kriteria, type NewSubKriteria } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type SubKriteriaFormState = {
  success?: boolean;
  error?: string;
  type?: "info" | "error" | "success";
};

export async function getSubKriteria() {
  try {
    const data = await db
      .select()
      .from(subKriteria)
      .leftJoin(kriteria, eq(subKriteria.kriteria_id, kriteria.id));

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching sub kriteria:", error);
    return { success: false, error: "Failed to fetch sub kriteria" };
  }
}

export async function createSubKriteria(
  prevState: SubKriteriaFormState,
  formData: FormData
): Promise<SubKriteriaFormState> {
  try {
    const kriteria_id = formData.get("kriteria_id");
    const nama = formData.get("nama");
    const bobot = formData.get("bobot");
    const keterangan = formData.get("keterangan");

    if (!kriteria_id || !nama || !bobot) {
      return { error: "Field kriteria, nama, dan bobot harus diisi!" };
    }

    if (
      typeof kriteria_id !== "string" ||
      typeof nama !== "string" ||
      typeof bobot !== "string"
    ) {
      return { error: "Data tidak valid!" };
    }

    const parsedKriteriaId = Number.parseInt(kriteria_id);
    if (isNaN(parsedKriteriaId)) {
      return { error: "ID kriteria tidak valid!" };
    }

    const existing = await db
      .select()
      .from(subKriteria)
      .where(
        and(
          eq(subKriteria.kriteria_id, parsedKriteriaId),
          eq(subKriteria.nama, nama)
        )
      );

    if (existing.length > 0) {
      return { error: "Nama sub kriteria sudah ada dalam kriteria ini!" };
    }

    const newSubKriteria: NewSubKriteria = {
      kriteria_id: parsedKriteriaId,
      nama,
      bobot,
      keterangan: typeof keterangan === "string" ? keterangan : null,
    };

    await db.insert(subKriteria).values(newSubKriteria);

    revalidatePath("/admin");
    revalidatePath("/admin/data-sub-kriteria");
    revalidatePath("/admin/data-penilaian");

    return { success: true };
  } catch (error) {
    console.error("Error creating sub kriteria:", error);
    return { error: "Gagal menambahkan data sub kriteria!" };
  }
}

export async function updateSubKriteria(
  id: number,
  prevState: SubKriteriaFormState,
  formData: FormData
): Promise<SubKriteriaFormState> {
  try {
    const kriteria_id = formData.get("kriteria_id");
    const nama = formData.get("nama");
    const bobot = formData.get("bobot");
    const keterangan = formData.get("keterangan");

    if (!kriteria_id || !nama || !bobot) {
      return { error: "Field kriteria, nama, dan bobot harus diisi!" };
    }

    if (
      typeof kriteria_id !== "string" ||
      typeof nama !== "string" ||
      typeof bobot !== "string"
    ) {
      return { error: "Data tidak valid!" };
    }

    const parsedKriteriaId = Number.parseInt(kriteria_id);
    if (isNaN(parsedKriteriaId)) {
      return { error: "ID kriteria tidak valid!" };
    }

    const existing = await db
      .select()
      .from(subKriteria)
      .where(
        and(
          eq(subKriteria.kriteria_id, parsedKriteriaId),
          eq(subKriteria.nama, nama)
        )
      );

    const duplicates = existing.filter((sub) => sub.id !== id);

    if (duplicates.length > 0) {
      return { error: "Nama sub kriteria sudah ada dalam kriteria ini!" };
    }

    const current = await db
      .select()
      .from(subKriteria)
      .where(eq(subKriteria.id, id));

    if (current.length > 0) {
      const currentData = current[0];
      const keteranganValue =
        typeof keterangan === "string" ? keterangan : null;
      if (
        currentData.kriteria_id === parsedKriteriaId &&
        currentData.nama === nama &&
        currentData.bobot === bobot &&
        currentData.keterangan === keteranganValue
      ) {
        return { error: "Data tidak ada perubahan!", type: "info" };
      }
    }

    const updateData: Partial<NewSubKriteria> = {
      kriteria_id: parsedKriteriaId,
      nama,
      bobot,
      keterangan: typeof keterangan === "string" ? keterangan : null,
    };

    await db.update(subKriteria).set(updateData).where(eq(subKriteria.id, id));

    revalidatePath("/admin");
    revalidatePath("/admin/data-sub-kriteria");
    revalidatePath("/admin/data-penilaian");

    return { success: true };
  } catch (error) {
    console.error("Error updating sub kriteria:", error);
    return { error: "Gagal memperbarui data sub kriteria!" };
  }
}

export async function deleteSubKriteria(
  id: number
): Promise<SubKriteriaFormState> {
  try {
    await db.delete(subKriteria).where(eq(subKriteria.id, id));

    revalidatePath("/admin");
    revalidatePath("/admin/data-sub-kriteria");
    revalidatePath("/admin/data-penilaian");

    return { success: true };
  } catch (error) {
    console.error("Error deleting sub kriteria:", error);
    return { error: "Failed to delete sub kriteria" };
  }
}
