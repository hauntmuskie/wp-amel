import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { kriteria } from "@/database/schema";
import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const data = await db.select().from(kriteria);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch kriteria" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kode, nama, bobot, jenis } = body;

    // Check for duplicates
    const existing = await db
      .select()
      .from(kriteria)
      .where(or(eq(kriteria.kode, kode), eq(kriteria.nama, nama)));

    if (existing.length > 0) {
      const duplicate = existing.find(krit => krit.kode === kode);
      if (duplicate) {
        return NextResponse.json(
          { error: "Kode kriteria sudah ada dalam database!" },
          { status: 409 }
        );
      }
      
      const duplicateName = existing.find(krit => krit.nama === nama);
      if (duplicateName) {
        return NextResponse.json(
          { error: "Nama kriteria sudah ada dalam database!" },
          { status: 409 }
        );
      }
    }

    await db.insert(kriteria).values({
      kode,
      nama,
      bobot,
      jenis,
    });

    // Revalidate related paths
    revalidatePath("/admin");
    revalidatePath("/admin/data-kriteria");
    revalidatePath("/admin/data-hasil-nilai");

    return NextResponse.json({ success: true, message: "Data kriteria berhasil ditambahkan!" });
  } catch (error) {
    console.error("Error creating kriteria:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data kriteria!" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, kode, nama, bobot, jenis } = body;

    // Check for duplicates excluding current record
    const existing = await db
      .select()
      .from(kriteria)
      .where(or(eq(kriteria.kode, kode), eq(kriteria.nama, nama)));

    const duplicates = existing.filter(krit => krit.id !== id);
    
    if (duplicates.length > 0) {
      const duplicate = duplicates.find(krit => krit.kode === kode);
      if (duplicate) {
        return NextResponse.json(
          { error: "Kode kriteria sudah ada dalam database!" },
          { status: 409 }
        );
      }
      
      const duplicateName = duplicates.find(krit => krit.nama === nama);
      if (duplicateName) {
        return NextResponse.json(
          { error: "Nama kriteria sudah ada dalam database!" },
          { status: 409 }
        );
      }
    }

    // Check if data is the same as current
    const current = await db
      .select()
      .from(kriteria)
      .where(eq(kriteria.id, id));

    if (current.length > 0) {
      const currentData = current[0];
      if (currentData.kode === kode && currentData.nama === nama && 
          currentData.bobot === bobot && currentData.jenis === jenis) {
        return NextResponse.json(
          { error: "Data tidak ada perubahan!", type: "info" },
          { status: 200 }
        );
      }
    }

    await db
      .update(kriteria)
      .set({ kode, nama, bobot, jenis })
      .where(eq(kriteria.id, id));

    // Revalidate related paths
    revalidatePath("/admin");
    revalidatePath("/admin/data-kriteria");
    revalidatePath("/admin/data-hasil-nilai");

    return NextResponse.json({ success: true, message: "Data kriteria berhasil diperbarui!" });
  } catch (error) {
    console.error("Error updating kriteria:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data kriteria!" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.delete(kriteria).where(eq(kriteria.id, parseInt(id)));

    // Revalidate related paths
    revalidatePath("/admin");
    revalidatePath("/admin/data-kriteria");
    revalidatePath("/admin/data-hasil-nilai");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete kriteria" },
      { status: 500 }
    );
  }
}
