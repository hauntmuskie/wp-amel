import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import {
  penilaian,
  alternatif,
  kriteria,
  sub_kriteria,
} from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET() {
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
        nama_sub_kriteria: sub_kriteria.nama,
      })
      .from(penilaian)
      .leftJoin(alternatif, eq(penilaian.alternatif_id, alternatif.id))
      .leftJoin(kriteria, eq(penilaian.kriteria_id, kriteria.id))
      .leftJoin(sub_kriteria, eq(penilaian.sub_kriteria_id, sub_kriteria.id));

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch penilaian" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { alternatif_id, kriteria_id, sub_kriteria_id, nilai } = body;

    // Check for duplicates (same alternatif and kriteria combination)
    const existing = await db
      .select()
      .from(penilaian)
      .where(and(
        eq(penilaian.alternatif_id, alternatif_id),
        eq(penilaian.kriteria_id, kriteria_id)
      ));

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Penilaian untuk alternatif dan kriteria ini sudah ada!" },
        { status: 409 }
      );
    }

    await db.insert(penilaian).values({
      alternatif_id,
      kriteria_id,
      sub_kriteria_id,
      nilai,
    });

    // Revalidate related paths
    revalidatePath("/admin");
    revalidatePath("/admin/data-penilaian");
    revalidatePath("/admin/data-hasil-nilai");

    return NextResponse.json({ success: true, message: "Data penilaian berhasil ditambahkan!" });
  } catch (error) {
    console.error("Error creating penilaian:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data penilaian!" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, alternatif_id, kriteria_id, sub_kriteria_id, nilai } = body;

    // Check if data is the same as current
    const current = await db
      .select()
      .from(penilaian)
      .where(eq(penilaian.id, id));

    if (current.length > 0) {
      const currentData = current[0];
      if (currentData.alternatif_id === alternatif_id && 
          currentData.kriteria_id === kriteria_id &&
          currentData.sub_kriteria_id === sub_kriteria_id && 
          currentData.nilai === nilai) {
        return NextResponse.json(
          { error: "Data tidak ada perubahan!", type: "info" },
          { status: 200 }
        );
      }
    }

    await db
      .update(penilaian)
      .set({ alternatif_id, kriteria_id, sub_kriteria_id, nilai })
      .where(eq(penilaian.id, id));

    // Revalidate related paths
    revalidatePath("/admin");
    revalidatePath("/admin/data-penilaian");
    revalidatePath("/admin/data-hasil-nilai");

    return NextResponse.json({ success: true, message: "Data penilaian berhasil diperbarui!" });
  } catch (error) {
    console.error("Error updating penilaian:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data penilaian!" },
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

    await db.delete(penilaian).where(eq(penilaian.id, parseInt(id)));

    // Revalidate related paths
    revalidatePath("/admin");
    revalidatePath("/admin/data-penilaian");
    revalidatePath("/admin/data-hasil-nilai");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete penilaian" },
      { status: 500 }
    );
  }
}
