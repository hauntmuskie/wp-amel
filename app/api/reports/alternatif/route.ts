import { NextResponse } from "next/server";
import { db } from "@/database";
import { alternatif } from "@/database/schema";

export async function GET() {
  try {
    const data = await db.select().from(alternatif).orderBy(alternatif.kode);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching alternatif report:", error);
    return NextResponse.json(
      { error: "Failed to fetch alternatif data" },
      { status: 500 }
    );
  }
}
