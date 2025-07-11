import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import {
  penilaian,
  alternatif,
  kriteria,
  sub_kriteria,
} from "@/database/schema";
import { eq } from "drizzle-orm";

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
  } catch (error) {
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

    await db.insert(penilaian).values({
      alternatif_id,
      kriteria_id,
      sub_kriteria_id,
      nilai,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create penilaian" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, alternatif_id, kriteria_id, sub_kriteria_id, nilai } = body;

    await db
      .update(penilaian)
      .set({ alternatif_id, kriteria_id, sub_kriteria_id, nilai })
      .where(eq(penilaian.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update penilaian" },
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

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete penilaian" },
      { status: 500 }
    );
  }
}
