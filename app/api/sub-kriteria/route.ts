import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { sub_kriteria, kriteria } from "@/database/schema";
import { eq } from "drizzle-orm";

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

    await db.insert(sub_kriteria).values({
      kriteria_id,
      nama,
      bobot,
      keterangan,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to create sub kriteria" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, kriteria_id, nama, bobot, keterangan } = body;

    await db
      .update(sub_kriteria)
      .set({ kriteria_id, nama, bobot, keterangan })
      .where(eq(sub_kriteria.id, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update sub kriteria" },
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

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete sub kriteria" },
      { status: 500 }
    );
  }
}
