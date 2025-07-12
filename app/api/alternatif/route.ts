import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { alternatif } from "@/database/schema";
import { eq } from "drizzle-orm";
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

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to create alternatif" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, kode, nama, jenis } = body;

    await db
      .update(alternatif)
      .set({ kode, nama, jenis })
      .where(eq(alternatif.id, id));

    // Revalidate related paths
    revalidatePath("/admin");
    revalidatePath("/admin/data-alternatif");
    revalidatePath("/admin/data-penilaian");
    revalidatePath("/admin/data-hasil-nilai");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update alternatif" },
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
