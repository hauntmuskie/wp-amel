import { NextResponse } from "next/server";
import { db } from "@/database";
import { penilaian, alternatif, kriteria, sub_kriteria } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        id: penilaian.id,
        nilai: penilaian.nilai,
        alternatif_kode: alternatif.kode,
        alternatif_nama: alternatif.nama,
        kriteria_kode: kriteria.kode,
        kriteria_nama: kriteria.nama,
        sub_kriteria_nama: sub_kriteria.nama,
        sub_kriteria_bobot: sub_kriteria.bobot,
      })
      .from(penilaian)
      .leftJoin(alternatif, eq(penilaian.alternatif_id, alternatif.id))
      .leftJoin(kriteria, eq(penilaian.kriteria_id, kriteria.id))
      .leftJoin(sub_kriteria, eq(penilaian.sub_kriteria_id, sub_kriteria.id))
      .orderBy(alternatif.kode, kriteria.kode);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching penilaian report:", error);
    return NextResponse.json(
      { error: "Failed to fetch penilaian data" },
      { status: 500 }
    );
  }
}
