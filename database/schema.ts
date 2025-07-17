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
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const alternatif = mysqlTable("alternatif", {
  id: int("id").primaryKey().autoincrement(),
  kode: varchar("kode", { length: 10 }).notNull().unique(),
  nama: varchar("nama", { length: 255 }).notNull(),
  jenis: mysqlEnum("jenis", ["Interior", "Eksterior"]).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const kriteria = mysqlTable("kriteria", {
  id: int("id").primaryKey().autoincrement(),
  kode: varchar("kode", { length: 10 }).notNull().unique(),
  nama: varchar("nama", { length: 255 }).notNull(),
  bobot: decimal("bobot", { precision: 5, scale: 2 }).notNull(),
  jenis: mysqlEnum("jenis", ["benefit", "cost"]).notNull().default("benefit"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const subKriteria = mysqlTable("sub_kriteria", {
  id: int("id").primaryKey().autoincrement(),
  kriteria_id: int("kriteria_id").notNull(),
  nama: varchar("nama", { length: 255 }).notNull(),
  bobot: decimal("bobot", { precision: 5, scale: 2 }).notNull(),
  keterangan: text("keterangan"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const penilaian = mysqlTable("penilaian", {
  id: int("id").primaryKey().autoincrement(),
  alternatif_id: int("alternatif_id").notNull(),
  kriteria_id: int("kriteria_id").notNull(),
  sub_kriteria_id: int("sub_kriteria_id").notNull(),
  nilai: decimal("nilai", { precision: 5, scale: 2 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const hasilPerhitungan = mysqlTable("hasil_perhitungan", {
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

export const normalisasiBobot = mysqlTable("normalisasi_bobot", {
  id: int("id").primaryKey().autoincrement(),
  kriteria_id: int("kriteria_id").notNull(),
  bobot_awal: decimal("bobot_awal", { precision: 5, scale: 2 }).notNull(),
  bobot_normal: decimal("bobot_normal", { precision: 10, scale: 6 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const alternatifRelations = relations(alternatif, ({ many }) => ({
  penilaian: many(penilaian),
  hasilPerhitungan: many(hasilPerhitungan),
}));

export const kriteriaRelations = relations(kriteria, ({ many }) => ({
  subKriteria: many(subKriteria),
  penilaian: many(penilaian),
  normalisasiBobot: many(normalisasiBobot),
}));

export const subKriteriaRelations = relations(subKriteria, ({ one, many }) => ({
  kriteria: one(kriteria, {
    fields: [subKriteria.kriteria_id],
    references: [kriteria.id],
  }),
  penilaian: many(penilaian),
}));

export const penilaianRelations = relations(penilaian, ({ one }) => ({
  alternatif: one(alternatif, {
    fields: [penilaian.alternatif_id],
    references: [alternatif.id],
  }),
  kriteria: one(kriteria, {
    fields: [penilaian.kriteria_id],
    references: [kriteria.id],
  }),
  subKriteria: one(subKriteria, {
    fields: [penilaian.sub_kriteria_id],
    references: [subKriteria.id],
  }),
}));

export const hasilPerhitunganRelations = relations(
  hasilPerhitungan,
  ({ one }) => ({
    alternatif: one(alternatif, {
      fields: [hasilPerhitungan.alternatif_id],
      references: [alternatif.id],
    }),
  })
);

export const normalisasiBobotRelations = relations(
  normalisasiBobot,
  ({ one }) => ({
    kriteria: one(kriteria, {
      fields: [normalisasiBobot.kriteria_id],
      references: [kriteria.id],
    }),
  })
);

export type alternatif = InferSelectModel<typeof alternatif>;
export type NewAlternatif = InferInsertModel<typeof alternatif>;

export type Kriteria = InferSelectModel<typeof kriteria>;
export type NewKriteria = InferInsertModel<typeof kriteria>;

export type SubKriteria = InferSelectModel<typeof subKriteria>;
export type NewSubKriteria = InferInsertModel<typeof subKriteria>;

export type Penilaian = InferSelectModel<typeof penilaian>;
export type NewPenilaian = InferInsertModel<typeof penilaian>;

export type HasilPerhitungan = InferSelectModel<typeof hasilPerhitungan>;
export type NewHasilPerhitungan = InferInsertModel<typeof hasilPerhitungan>;

export type NormalisasiBobot = InferSelectModel<typeof normalisasiBobot>;
export type NewNormalisasiBobot = InferInsertModel<typeof normalisasiBobot>;
