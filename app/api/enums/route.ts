import { NextResponse } from "next/server";

export async function GET() {
  try {
    const enums = {
      jenisAlternatif: [
        { value: "Interior", label: "Interior" },
        { value: "Eksterior", label: "Eksterior" },
      ],
      jenisKriteria: [
        { value: "benefit", label: "Benefit" },
        { value: "cost", label: "Cost" },
      ],
    };

    return NextResponse.json(enums);
  } catch (error) {
    console.error("Error fetching enums:", error);
    return NextResponse.json(
      { error: "Failed to fetch enum values" },
      { status: 500 }
    );
  }
}
