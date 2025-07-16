import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { alternatif } from "@/database/schema";
import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const data = await db.select().from(alternatif);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch alternatif" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kode, nama, jenis } = body;

    // Check for duplicates
    const existing = await db
      .select()
      .from(alternatif)
      .where(or(eq(alternatif.kode, kode), eq(alternatif.nama, nama)));

    if (existing.length > 0) {
      const duplicate = existing.find(alt => alt.kode === kode);
      if (duplicate) {
        return NextResponse.json(
          { error: "Kode alternatif sudah ada dalam database!" },
          { status: 409 }
        );
      }
      
      const duplicateName = existing.find(alt => alt.nama === nama);
      if (duplicateName) {
        return NextResponse.json(
          { error: "Nama alternatif sudah ada dalam database!" },
          { status: 409 }
        );
      }
    }

    await db.insert(alternatif).values({
      kode,
      nama,
      jenis,
    });

    // Revalidate related paths
    revalidatePath("/admin");
    revalidatePath("/admin/data-alternatif");
    revalidatePath("/admin/data-penilaian");
    revalidatePath("/admin/data-hasil-nilai");

    return NextResponse.json({ success: true, message: "Data alternatif berhasil ditambahkan!" });
  } catch (error) {
    console.error("Error creating alternatif:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data alternatif!" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, kode, nama, jenis } = body;

    // Check for duplicates excluding current record
    const existing = await db
      .select()
      .from(alternatif)
      .where(or(eq(alternatif.kode, kode), eq(alternatif.nama, nama)));

    const duplicates = existing.filter(alt => alt.id !== id);
    
    if (duplicates.length > 0) {
      const duplicate = duplicates.find(alt => alt.kode === kode);
      if (duplicate) {
        return NextResponse.json(
          { error: "Kode alternatif sudah ada dalam database!" },
          { status: 409 }
        );
      }
      
      const duplicateName = duplicates.find(alt => alt.nama === nama);
      if (duplicateName) {
        return NextResponse.json(
          { error: "Nama alternatif sudah ada dalam database!" },
          { status: 409 }
        );
      }
    }

    // Check if data is the same as current
    const current = await db
      .select()
      .from(alternatif)
      .where(eq(alternatif.id, id));

    if (current.length > 0) {
      const currentData = current[0];
      if (currentData.kode === kode && currentData.nama === nama && currentData.jenis === jenis) {
        return NextResponse.json(
          { error: "Data tidak ada perubahan!", type: "info" },
          { status: 200 }
        );
      }
    }

    await db
      .update(alternatif)
      .set({ kode, nama, jenis })
      .where(eq(alternatif.id, id));

    // Revalidate related paths
    revalidatePath("/admin");
    revalidatePath("/admin/data-alternatif");
    revalidatePath("/admin/data-penilaian");
    revalidatePath("/admin/data-hasil-nilai");

    return NextResponse.json({ success: true, message: "Data alternatif berhasil diperbarui!" });
  } catch (error) {
    console.error("Error updating alternatif:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data alternatif!" },
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

    await db.delete(alternatif).where(eq(alternatif.id, parseInt(id)));

    // Revalidate related paths
    revalidatePath("/admin");
    revalidatePath("/admin/data-alternatif");
    revalidatePath("/admin/data-penilaian");
    revalidatePath("/admin/data-hasil-nilai");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete alternatif" },
      { status: 500 }
    );
  }
}
