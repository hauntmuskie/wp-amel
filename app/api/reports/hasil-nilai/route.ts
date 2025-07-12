import { NextResponse } from "next/server";
import { db } from "@/database";
import { hasil_perhitungan, alternatif } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        id: hasil_perhitungan.id,
        nilai_vektor_s: hasil_perhitungan.nilai_vektor_s,
        nilai_vektor_v: hasil_perhitungan.nilai_vektor_v,
        ranking: hasil_perhitungan.ranking,
        alternatif_kode: alternatif.kode,
        alternatif_nama: alternatif.nama,
        alternatif_jenis: alternatif.jenis,
      })
      .from(hasil_perhitungan)
      .leftJoin(alternatif, eq(hasil_perhitungan.alternatif_id, alternatif.id))
      .orderBy(hasil_perhitungan.ranking);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching hasil nilai report:", error);
    return NextResponse.json(
      { error: "Failed to fetch hasil nilai data" },
      { status: 500 }
    );
  }
}
