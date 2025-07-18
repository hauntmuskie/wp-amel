"use server";

import { db } from "@/database";
import { subKriteria, kriteria } from "@/database/schema";
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
      .select({
        id: subKriteria.id,
        kriteria_id: subKriteria.kriteria_id,
        nama: subKriteria.nama,
        bobot: subKriteria.bobot,
        keterangan: subKriteria.keterangan,
        kode_kriteria: kriteria.kode,
        nama_kriteria: kriteria.nama,
      })
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
    const kriteria_id = Number.parseInt(formData.get("kriteria_id") as string);
    const nama = formData.get("nama") as string;
    const bobot = formData.get("bobot") as string;
    const keterangan = formData.get("keterangan") as string;

    if (!kriteria_id || !nama || !bobot) {
      return { error: "Field kriteria, nama, dan bobot harus diisi!" };
    }

    const existing = await db
      .select()
      .from(subKriteria)
      .where(
        and(
          eq(subKriteria.kriteria_id, kriteria_id),
          eq(subKriteria.nama, nama)
        )
      );

    if (existing.length > 0) {
      return { error: "Nama sub kriteria sudah ada dalam kriteria ini!" };
    }

    await db.insert(subKriteria).values({
      kriteria_id,
      nama,
      bobot,
      keterangan,
    });

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
    const kriteria_id = Number.parseInt(formData.get("kriteria_id") as string);
    const nama = formData.get("nama") as string;
    const bobot = formData.get("bobot") as string;
    const keterangan = formData.get("keterangan") as string;

    if (!kriteria_id || !nama || !bobot) {
      return { error: "Field kriteria, nama, dan bobot harus diisi!" };
    }

    const existing = await db
      .select()
      .from(subKriteria)
      .where(
        and(
          eq(subKriteria.kriteria_id, kriteria_id),
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
      if (
        currentData.kriteria_id === kriteria_id &&
        currentData.nama === nama &&
        currentData.bobot === bobot &&
        currentData.keterangan === keterangan
      ) {
        return { error: "Data tidak ada perubahan!", type: "info" };
      }
    }

    await db
      .update(subKriteria)
      .set({ kriteria_id, nama, bobot, keterangan })
      .where(eq(subKriteria.id, id));

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
