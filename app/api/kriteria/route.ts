import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { kriteria } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(kriteria);
    return NextResponse.json(data);
  } catch (error) {
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

    await db.insert(kriteria).values({
      kode,
      nama,
      bobot,
      jenis,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create kriteria" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, kode, nama, bobot, jenis } = body;

    await db
      .update(kriteria)
      .set({ kode, nama, bobot, jenis })
      .where(eq(kriteria.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update kriteria" },
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

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete kriteria" },
      { status: 500 }
    );
  }
}
