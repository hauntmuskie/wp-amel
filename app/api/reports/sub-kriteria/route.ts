import { NextResponse } from "next/server";
import { db } from "@/database";
import { sub_kriteria, kriteria } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        id: sub_kriteria.id,
        nama: sub_kriteria.nama,
        bobot: sub_kriteria.bobot,
        keterangan: sub_kriteria.keterangan,
        kriteria_nama: kriteria.nama,
        kriteria_kode: kriteria.kode,
      })
      .from(sub_kriteria)
      .leftJoin(kriteria, eq(sub_kriteria.kriteria_id, kriteria.id))
      .orderBy(kriteria.kode, sub_kriteria.nama);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching sub kriteria report:", error);
    return NextResponse.json(
      { error: "Failed to fetch sub kriteria data" },
      { status: 500 }
    );
  }
}
