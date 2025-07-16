"use server";

export async function getEnums() {
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

    return { success: true, data: enums };
  } catch (error) {
    console.error("Error fetching enums:", error);
    return { success: false, error: "Failed to fetch enum values" };
  }
}
