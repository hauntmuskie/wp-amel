import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { sub_kriteria, kriteria } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const data = await db
      .select({
        id: sub_kriteria.id,
        kriteria_id: sub_kriteria.kriteria_id,
        nama: sub_kriteria.nama,
        bobot: sub_kriteria.bobot,
        keterangan: sub_kriteria.keterangan,
        kode_kriteria: kriteria.kode,
        nama_kriteria: kriteria.nama,
      })
      .from(sub_kriteria)
      .leftJoin(kriteria, eq(sub_kriteria.kriteria_id, kriteria.id));

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch sub kriteria" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kriteria_id, nama, bobot, keterangan } = body;

    // Check for duplicates within the same kriteria
    const existing = await db
      .select()
      .from(sub_kriteria)
      .where(and(
        eq(sub_kriteria.kriteria_id, kriteria_id),
        eq(sub_kriteria.nama, nama)
      ));

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Nama sub kriteria sudah ada dalam kriteria ini!" },
        { status: 409 }
      );
    }

    await db.insert(sub_kriteria).values({
      kriteria_id,
      nama,
      bobot,
      keterangan,
    });

    // Revalidate related paths
    revalidatePath("/admin");
    revalidatePath("/admin/data-sub-kriteria");
    revalidatePath("/admin/data-penilaian");

    return NextResponse.json({ success: true, message: "Data sub kriteria berhasil ditambahkan!" });
  } catch (error) {
    console.error("Error creating sub kriteria:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data sub kriteria!" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, kriteria_id, nama, bobot, keterangan } = body;

    // Check for duplicates within the same kriteria excluding current record
    const existing = await db
      .select()
      .from(sub_kriteria)
      .where(and(
        eq(sub_kriteria.kriteria_id, kriteria_id),
        eq(sub_kriteria.nama, nama)
      ));

    const duplicates = existing.filter(sub => sub.id !== id);
    
    if (duplicates.length > 0) {
      return NextResponse.json(
        { error: "Nama sub kriteria sudah ada dalam kriteria ini!" },
        { status: 409 }
      );
    }

    // Check if data is the same as current
    const current = await db
      .select()
      .from(sub_kriteria)
      .where(eq(sub_kriteria.id, id));

    if (current.length > 0) {
      const currentData = current[0];
      if (currentData.kriteria_id === kriteria_id && currentData.nama === nama && 
          currentData.bobot === bobot && currentData.keterangan === keterangan) {
        return NextResponse.json(
          { error: "Data tidak ada perubahan!", type: "info" },
          { status: 200 }
        );
      }
    }

    await db
      .update(sub_kriteria)
      .set({ kriteria_id, nama, bobot, keterangan })
      .where(eq(sub_kriteria.id, id));

    // Revalidate related paths
    revalidatePath("/admin");
    revalidatePath("/admin/data-sub-kriteria");
    revalidatePath("/admin/data-penilaian");

    return NextResponse.json({ success: true, message: "Data sub kriteria berhasil diperbarui!" });
  } catch (error) {
    console.error("Error updating sub kriteria:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data sub kriteria!" },
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

    await db.delete(sub_kriteria).where(eq(sub_kriteria.id, parseInt(id)));

    // Revalidate related paths
    revalidatePath("/admin");
    revalidatePath("/admin/data-sub-kriteria");
    revalidatePath("/admin/data-penilaian");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete sub kriteria" },
      { status: 500 }
    );
  }
}
