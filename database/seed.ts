import { db } from "./index";
import {
  alternatif,
  kriteria,
  sub_kriteria,
  penilaian,
  type NewPenilaian,
} from "./schema";

// ========================================
// DATABASE SEED FILE FOR WP-AMEL PROJECT
// Weighted Product Method Implementation
// Based on Paint Selection Research Paper
// ========================================

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data (optional)
    console.log("🧹 Clearing existing data...");
    // Temporarily commented out to debug the insertion issue
    // await db.delete(penilaian);
    // await db.delete(sub_kriteria);
    // await db.delete(kriteria);
    // await db.delete(alternatif);

    // ========================================
    // ALTERNATIF DATA (Paint Brands)
    // ========================================
    console.log("📝 Seeding alternatif data...");
    const alternatifData = [
      {
        kode: "A1",
        nama: "Nippon Paint Vinilex",
        jenis: "Interior" as const,
      },
      {
        kode: "A2",
        nama: "Aquaproof",
        jenis: "Interior" as const,
      },
      {
        kode: "A3",
        nama: "Dulux Catylac",
        jenis: "Eksterior" as const,
      },
      {
        kode: "A4",
        nama: "Mowilex Emulsion",
        jenis: "Eksterior" as const,
      },
      {
        kode: "A5",
        nama: "No Drop",
        jenis: "Interior" as const,
      },
    ];

    await db.insert(alternatif).values(alternatifData);

    // ========================================
    // KRITERIA DATA (Evaluation Criteria)
    // ========================================
    console.log("📊 Seeding kriteria data...");
    const kriteriaData = [
      {
        kode: "C1",
        nama: "Kualitas Pigmen",
        bobot: "5",
        jenis: "benefit" as const,
      },
      {
        kode: "C2",
        nama: "Harga",
        bobot: "4",
        jenis: "cost" as const,
      },
      {
        kode: "C3",
        nama: "Ketahanan",
        bobot: "5",
        jenis: "benefit" as const,
      },
      {
        kode: "C4",
        nama: "Daya Sebar",
        bobot: "3",
        jenis: "benefit" as const,
      },
      {
        kode: "C5",
        nama: "Waktu Pengeringan",
        bobot: "3",
        jenis: "benefit" as const,
      },
    ];

    await db.insert(kriteria).values(kriteriaData);

    // Get inserted IDs for foreign key relationships
    const kriteriaIds = await db.select().from(kriteria);
    const alternatifIds = await db.select().from(alternatif);

    // ========================================
    // SUB KRITERIA DATA (Sub-criteria Details)
    // ========================================
    console.log("📋 Seeding sub kriteria data...");

    // Helper function to get kriteria ID by code
    const getKriteriaId = (kode: string) => {
      const k = kriteriaIds.find((item) => item.kode === kode);
      if (!k?.id) {
        throw new Error(`Kriteria with kode ${kode} not found`);
      }
      return k.id;
    };

    const subKriteriaData = [
      // C1 - Kualitas Pigmen (Pigment Quality)
      {
        kriteria_id: getKriteriaId("C1"),
        nama: "Sangat Tajam",
        bobot: "5",
        keterangan: "Pigmen sangat tajam dan berkualitas tinggi",
      },
      {
        kriteria_id: getKriteriaId("C1"),
        nama: "Tajam",
        bobot: "4",
        keterangan: "Pigmen tajam dan berkualitas baik",
      },
      {
        kriteria_id: getKriteriaId("C1"),
        nama: "Cukup Tajam",
        bobot: "3",
        keterangan: "Pigmen cukup tajam",
      },
      {
        kriteria_id: getKriteriaId("C1"),
        nama: "Kurang Tajam",
        bobot: "2",
        keterangan: "Pigmen kurang tajam",
      },
      {
        kriteria_id: getKriteriaId("C1"),
        nama: "Pucat",
        bobot: "1",
        keterangan: "Pigmen pucat dan kurang berkualitas",
      },

      // C2 - Harga (Price)
      {
        kriteria_id: getKriteriaId("C2"),
        nama: "< Rp 150.000 /Kg",
        bobot: "5",
        keterangan: "Harga sangat terjangkau",
      },
      {
        kriteria_id: getKriteriaId("C2"),
        nama: "Rp 150.000 - 200.000 /Kg",
        bobot: "4",
        keterangan: "Harga terjangkau",
      },
      {
        kriteria_id: getKriteriaId("C2"),
        nama: "Rp 200.000 - 300.000 /Kg",
        bobot: "3",
        keterangan: "Harga standar",
      },
      {
        kriteria_id: getKriteriaId("C2"),
        nama: "Rp 300.000 - 400.000 /Kg",
        bobot: "2",
        keterangan: "Harga tinggi",
      },
      {
        kriteria_id: getKriteriaId("C2"),
        nama: "> Rp 400.000 /Kg",
        bobot: "1",
        keterangan: "Harga sangat tinggi",
      },

      // C3 - Ketahanan (Durability)
      {
        kriteria_id: getKriteriaId("C3"),
        nama: "Sangat Tahan lama",
        bobot: "5",
        keterangan: "Daya tahan sangat lama",
      },
      {
        kriteria_id: getKriteriaId("C3"),
        nama: "Tahan Lama",
        bobot: "4",
        keterangan: "Daya tahan lama",
      },
      {
        kriteria_id: getKriteriaId("C3"),
        nama: "Cukup Tahan Lama",
        bobot: "3",
        keterangan: "Daya tahan cukup",
      },
      {
        kriteria_id: getKriteriaId("C3"),
        nama: "Kurang Tahan Lama",
        bobot: "2",
        keterangan: "Daya tahan kurang",
      },
      {
        kriteria_id: getKriteriaId("C3"),
        nama: "Tidak Tahan Lama",
        bobot: "1",
        keterangan: "Daya tahan rendah",
      },

      // C4 - Daya Sebar (Spreading Power)
      {
        kriteria_id: getKriteriaId("C4"),
        nama: "> 12 m²/Kg",
        bobot: "5",
        keterangan: "Daya sebar sangat baik",
      },
      {
        kriteria_id: getKriteriaId("C4"),
        nama: "10 - 12 m²/Kg",
        bobot: "4",
        keterangan: "Daya sebar baik",
      },
      {
        kriteria_id: getKriteriaId("C4"),
        nama: "8 - 10 m²/Kg",
        bobot: "3",
        keterangan: "Daya sebar cukup",
      },
      {
        kriteria_id: getKriteriaId("C4"),
        nama: "6 - 8 m²/Kg",
        bobot: "2",
        keterangan: "Daya sebar kurang",
      },
      {
        kriteria_id: getKriteriaId("C4"),
        nama: "< 6 m²/Kg",
        bobot: "1",
        keterangan: "Daya sebar rendah",
      },

      // C5 - Waktu Pengeringan (Drying Time)
      {
        kriteria_id: getKriteriaId("C5"),
        nama: "-+ 5 Jam",
        bobot: "1",
        keterangan: "Sangat buruk",
      },
      {
        kriteria_id: getKriteriaId("C5"),
        nama: "3 Jam",
        bobot: "2",
        keterangan: "Buruk",
      },
      {
        kriteria_id: getKriteriaId("C5"),
        nama: "1 jam - 2 Jam",
        bobot: "3",
        keterangan: "Cukup",
      },
      {
        kriteria_id: getKriteriaId("C5"),
        nama: "1 Jam",
        bobot: "4",
        keterangan: "Baik",
      },
      {
        kriteria_id: getKriteriaId("C5"),
        nama: "40 Menit - 1 Jam",
        bobot: "5",
        keterangan: "Sangat baik",
      },
    ];

    await db.insert(sub_kriteria).values(subKriteriaData);

    // Get all sub_kriteria for penilaian relationships
    const subKriteriaIds = await db.select().from(sub_kriteria);

    // Debug: Log sub-kriteria for verification
    console.log("🔍 Debug: Sub-kriteria inserted:");
    subKriteriaIds.forEach((sk) => {
      const kriteriaInfo = kriteriaIds.find((k) => k.id === sk.kriteria_id);
      console.log(
        `  ID: ${sk.id}, Kriteria: ${kriteriaInfo?.kode}, Bobot: ${sk.bobot}, Nama: ${sk.nama}`
      );
    });

    // ========================================
    // PENILAIAN DATA (Assessment Matrix)
    // Based on research paper evaluation matrix
    // ========================================
    console.log("📈 Seeding penilaian data...");

    // Helper functions
    const getAlternatifId = (kode: string) => {
      const a = alternatifIds.find((item) => item.kode === kode);
      if (!a?.id) {
        throw new Error(`Alternatif with kode ${kode} not found`);
      }
      return a.id;
    };

    const getSubKriteriaId = (kriteriaKode: string, bobot: string) => {
      const kriteriaId = getKriteriaId(kriteriaKode);
      if (!kriteriaId) {
        throw new Error(`Kriteria with kode ${kriteriaKode} not found`);
      }

      // Convert bobot to decimal for comparison
      const sk = subKriteriaIds.find(
        (item) =>
          item.kriteria_id === kriteriaId &&
          Number(item.bobot) === Number(bobot)
      );

      if (!sk?.id) {
        console.error(
          `Sub-kriteria not found for kriteria ${kriteriaKode} with bobot ${bobot}`
        );
        console.error(
          `Available sub-kriteria for kriteria ${kriteriaId}:`,
          subKriteriaIds.filter((item) => item.kriteria_id === kriteriaId)
        );
        throw new Error(
          `Sub-kriteria with kriteria_kode ${kriteriaKode} and bobot ${bobot} not found`
        );
      }

      return sk.id;
    };

    // Assessment Matrix Data
    // A1 - Nippon Paint Vinilex: C1=5, C2=3, C3=3, C4=4, C5=4
    // A2 - Aquaproof: C1=4, C2=2, C3=5, C4=1, C5=3
    // A3 - Dulux Catylac: C1=3, C2=2, C3=3, C4=4, C5=5
    // A4 - Mowilex Emulsion: C1=4, C2=3, C3=4, C4=5, C5=2
    // A5 - No Drop: C1=4, C2=4, C3=3, C4=1, C5=3

    const assessmentMatrix = [
      { alternatif: "A1", C1: "5", C2: "3", C3: "3", C4: "4", C5: "4" },
      { alternatif: "A2", C1: "4", C2: "2", C3: "5", C4: "1", C5: "3" },
      { alternatif: "A3", C1: "3", C2: "2", C3: "3", C4: "4", C5: "5" },
      { alternatif: "A4", C1: "4", C2: "3", C3: "4", C4: "5", C5: "2" },
      { alternatif: "A5", C1: "4", C2: "4", C3: "3", C4: "1", C5: "3" },
    ];

    const penilaianData: NewPenilaian[] = [];

    assessmentMatrix.forEach((row) => {
      const alternatifId = getAlternatifId(row.alternatif);

      // Create penilaian records for each criteria
      Object.entries(row).forEach(([key, value]) => {
        if (key !== "alternatif") {
          const kriteriaId = getKriteriaId(key);
          const subKriteriaId = getSubKriteriaId(key, value);

          penilaianData.push({
            alternatif_id: alternatifId,
            kriteria_id: kriteriaId,
            sub_kriteria_id: subKriteriaId,
            nilai: value,
          });
        }
      });
    });

    await db.insert(penilaian).values(penilaianData);

    console.log("✅ Database seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - ${alternatifData.length} Alternatif records`);
    console.log(`   - ${kriteriaData.length} Kriteria records`);
    console.log(`   - ${subKriteriaData.length} Sub Kriteria records`);
    console.log(`   - ${penilaianData.length} Penilaian records`);

    // Verification
    console.log("\n🔍 Verifying seeded data...");
    const alternatifCount = await db.select().from(alternatif);
    const kriteriaCount = await db.select().from(kriteria);
    const subKriteriaCount = await db.select().from(sub_kriteria);
    const penilaianCount = await db.select().from(penilaian);

    console.log(`✅ Verification Results:`);
    console.log(`   - Alternatif: ${alternatifCount.length} records`);
    console.log(`   - Kriteria: ${kriteriaCount.length} records`);
    console.log(`   - Sub Kriteria: ${subKriteriaCount.length} records`);
    console.log(`   - Penilaian: ${penilaianCount.length} records`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

main()
  .then(() => {
    console.log("🎉 Seeding process completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seeding process failed:", error);
    process.exit(1);
  });
