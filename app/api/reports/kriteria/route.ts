import { NextResponse } from "next/server";
import { db } from "@/database/dev";
import { kriteria } from "@/database/schema";

export async function GET() {
  try {
    const data = await db.select().from(kriteria).orderBy(kriteria.kode);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching kriteria report:", error);
    return NextResponse.json(
      { error: "Failed to fetch kriteria data" },
      { status: 500 }
    );
  }
}
