import {
  mysqlTable,
  varchar,
  decimal,
  int,
  text,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// Tabel Alternatif - Data alternatif cat dinding
export const alternatif = mysqlTable("alternatif", {
  id: int("id").primaryKey().autoincrement(),
  kode: varchar("kode", { length: 10 }).notNull().unique(),
  nama: varchar("nama", { length: 255 }).notNull(),
  jenis: mysqlEnum("jenis", ["Interior", "Eksterior"]).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Tabel Kriteria - Data kriteria penilaian
export const kriteria = mysqlTable("kriteria", {
  id: int("id").primaryKey().autoincrement(),
  kode: varchar("kode", { length: 10 }).notNull().unique(),
  nama: varchar("nama", { length: 255 }).notNull(),
  bobot: decimal("bobot", { precision: 5, scale: 2 }).notNull(),
  jenis: mysqlEnum("jenis", ["benefit", "cost"]).notNull().default("benefit"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Tabel Sub Kriteria - Data sub kriteria untuk setiap kriteria
export const sub_kriteria = mysqlTable("sub_kriteria", {
  id: int("id").primaryKey().autoincrement(),
  kriteria_id: int("kriteria_id").notNull(),
  nama: varchar("nama", { length: 255 }).notNull(),
  bobot: decimal("bobot", { precision: 5, scale: 2 }).notNull(),
  keterangan: text("keterangan"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Tabel Penilaian - Data penilaian alternatif berdasarkan kriteria
export const penilaian = mysqlTable("penilaian", {
  id: int("id").primaryKey().autoincrement(),
  alternatif_id: int("alternatif_id").notNull(),
  kriteria_id: int("kriteria_id").notNull(),
  sub_kriteria_id: int("sub_kriteria_id").notNull(),
  nilai: decimal("nilai", { precision: 5, scale: 2 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Tabel Hasil Perhitungan - Data hasil perhitungan WP
export const hasil_perhitungan = mysqlTable("hasil_perhitungan", {
  id: int("id").primaryKey().autoincrement(),
  alternatif_id: int("alternatif_id").notNull(),
  nilai_vektor_s: decimal("nilai_vektor_s", {
    precision: 10,
    scale: 6,
  }).notNull(),
  nilai_vektor_v: decimal("nilai_vektor_v", {
    precision: 10,
    scale: 6,
  }).notNull(),
  ranking: int("ranking").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Tabel Normalisasi Bobot - Data normalisasi bobot kriteria
export const normalisasi_bobot = mysqlTable("normalisasi_bobot", {
  id: int("id").primaryKey().autoincrement(),
  kriteria_id: int("kriteria_id").notNull(),
  bobot_awal: decimal("bobot_awal", { precision: 5, scale: 2 }).notNull(),
  bobot_normal: decimal("bobot_normal", { precision: 10, scale: 6 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Relations
export const alternatifRelations = relations(alternatif, ({ many }) => ({
  penilaian: many(penilaian),
  hasil_perhitungan: many(hasil_perhitungan),
}));

export const kriteriaRelations = relations(kriteria, ({ many }) => ({
  sub_kriteria: many(sub_kriteria),
  penilaian: many(penilaian),
  normalisasi_bobot: many(normalisasi_bobot),
}));

export const subKriteriaRelations = relations(
  sub_kriteria,
  ({ one, many }) => ({
    kriteria: one(kriteria, {
      fields: [sub_kriteria.kriteria_id],
      references: [kriteria.id],
    }),
    penilaian: many(penilaian),
  })
);

export const penilaianRelations = relations(penilaian, ({ one }) => ({
  alternatif: one(alternatif, {
    fields: [penilaian.alternatif_id],
    references: [alternatif.id],
  }),
  kriteria: one(kriteria, {
    fields: [penilaian.kriteria_id],
    references: [kriteria.id],
  }),
  sub_kriteria: one(sub_kriteria, {
    fields: [penilaian.sub_kriteria_id],
    references: [sub_kriteria.id],
  }),
}));

export const hasilPerhitunganRelations = relations(
  hasil_perhitungan,
  ({ one }) => ({
    alternatif: one(alternatif, {
      fields: [hasil_perhitungan.alternatif_id],
      references: [alternatif.id],
    }),
  })
);

export const normalisasiBobotRelations = relations(
  normalisasi_bobot,
  ({ one }) => ({
    kriteria: one(kriteria, {
      fields: [normalisasi_bobot.kriteria_id],
      references: [kriteria.id],
    }),
  })
);

// Export types
export type Alternatif = typeof alternatif.$inferSelect;
export type NewAlternatif = typeof alternatif.$inferInsert;

export type Kriteria = typeof kriteria.$inferSelect;
export type NewKriteria = typeof kriteria.$inferInsert;

export type SubKriteria = typeof sub_kriteria.$inferSelect;
export type NewSubKriteria = typeof sub_kriteria.$inferInsert;

export type Penilaian = typeof penilaian.$inferSelect;
export type NewPenilaian = typeof penilaian.$inferInsert;

export type HasilPerhitungan = typeof hasil_perhitungan.$inferSelect;
export type NewHasilPerhitungan = typeof hasil_perhitungan.$inferInsert;

export type NormalisasiBobot = typeof normalisasi_bobot.$inferSelect;
export type NewNormalisasiBobot = typeof normalisasi_bobot.$inferInsert;
