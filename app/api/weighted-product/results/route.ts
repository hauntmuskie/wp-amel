import { NextResponse } from "next/server";
import { db } from "@/database";
import {
  hasil_perhitungan,
  alternatif,
  normalisasi_bobot,
  kriteria,
} from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Ambil hasil perhitungan
    const hasilData = await db
      .select({
        id: hasil_perhitungan.id,
        alternatif_id: hasil_perhitungan.alternatif_id,
        kode_alternatif: alternatif.kode,
        nama_alternatif: alternatif.nama,
        nilai_vektor_s: hasil_perhitungan.nilai_vektor_s,
        nilai_vektor_v: hasil_perhitungan.nilai_vektor_v,
        ranking: hasil_perhitungan.ranking,
      })
      .from(hasil_perhitungan)
      .leftJoin(alternatif, eq(hasil_perhitungan.alternatif_id, alternatif.id))
      .orderBy(hasil_perhitungan.ranking);

    // Ambil normalisasi bobot
    const normalisasiData = await db
      .select({
        id: normalisasi_bobot.id,
        kriteria_id: normalisasi_bobot.kriteria_id,
        kode_kriteria: kriteria.kode,
        nama_kriteria: kriteria.nama,
        jenis_kriteria: kriteria.jenis,
        bobot_awal: normalisasi_bobot.bobot_awal,
        bobot_normal: normalisasi_bobot.bobot_normal,
      })
      .from(normalisasi_bobot)
      .leftJoin(kriteria, eq(normalisasi_bobot.kriteria_id, kriteria.id));

    return NextResponse.json({
      hasil_perhitungan: hasilData,
      normalisasi_bobot: normalisasiData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
