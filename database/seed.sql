-- ========================================
-- DATABASE SEED FILE FOR WP-AMEL PROJECT
-- Weighted Product Method Implementation
-- Based on Paint Selection Research Paper
-- ========================================

-- Clear existing data (optional - uncomment if needed)
-- DELETE FROM penilaian;
-- DELETE FROM sub_kriteria;
-- DELETE FROM kriteria;
-- DELETE FROM alternatif;
-- ========================================
-- 
-- ALTERNATIF DATA (Paint Brands)
-- ========================================
INSERT INTO alternatif (kode, nama, jenis) VALUES
('A1', 'Nippon Paint Vinilex', 'Interior'),
('A2', 'Aquaproof', 'Interior'),
('A3', 'Dulux Catylac', 'Eksterior'),
('A4', 'Mowilex Emulsion', 'Eksterior'),
('A5', 'No Drop', 'Interior')
ON DUPLICATE KEY UPDATE 
    nama = VALUES(nama),
    jenis = VALUES(jenis);

-- ========================================
-- KRITERIA DATA (Evaluation Criteria)
-- ========================================
INSERT INTO kriteria (kode, nama, bobot, jenis) VALUES
('C1', 'Kualitas Pigmen', '5', 'benefit'),
('C2', 'Harga', '4', 'cost'),
('C3', 'Ketahanan', '5', 'benefit'),
('C4', 'Daya Sebar', '3', 'benefit'),
('C5', 'Waktu Pengeringan', '3', 'benefit')
ON DUPLICATE KEY UPDATE 
    nama = VALUES(nama),
    bobot = VALUES(bobot),
    jenis = VALUES(jenis);

-- ========================================
-- SUB KRITERIA DATA (Sub-criteria Details)
-- ========================================

-- C1 - Kualitas Pigmen (Pigment Quality)
INSERT INTO sub_kriteria (kriteria_id, nama, bobot, keterangan) VALUES
((SELECT id FROM kriteria WHERE kode = 'C1'), 'Sangat Tajam', '5', 'Pigmen sangat tajam dan berkualitas tinggi'),
((SELECT id FROM kriteria WHERE kode = 'C1'), 'Tajam', '4', 'Pigmen tajam dan berkualitas baik'),
((SELECT id FROM kriteria WHERE kode = 'C1'), 'Cukup Tajam', '3', 'Pigmen cukup tajam'),
((SELECT id FROM kriteria WHERE kode = 'C1'), 'Kurang Tajam', '2', 'Pigmen kurang tajam'),
((SELECT id FROM kriteria WHERE kode = 'C1'), 'Pucat', '1', 'Pigmen pucat dan kurang berkualitas');

-- C2 - Harga (Price)
INSERT INTO sub_kriteria (kriteria_id, nama, bobot, keterangan) VALUES
((SELECT id FROM kriteria WHERE kode = 'C2'), '< Rp 150.000 /Kg', '5', 'Harga sangat terjangkau'),
((SELECT id FROM kriteria WHERE kode = 'C2'), 'Rp 150.000 - 200.000 /Kg', '4', 'Harga terjangkau'),
((SELECT id FROM kriteria WHERE kode = 'C2'), 'Rp 200.000 - 300.000 /Kg', '3', 'Harga standar'),
((SELECT id FROM kriteria WHERE kode = 'C2'), 'Rp 300.000 - 400.000 /Kg', '2', 'Harga tinggi'),
((SELECT id FROM kriteria WHERE kode = 'C2'), '> Rp 400.000 /Kg', '1', 'Harga sangat tinggi');

-- C3 - Ketahanan (Durability)
INSERT INTO sub_kriteria (kriteria_id, nama, bobot, keterangan) VALUES
((SELECT id FROM kriteria WHERE kode = 'C3'), 'Sangat Tahan lama', '5', 'Daya tahan sangat lama'),
((SELECT id FROM kriteria WHERE kode = 'C3'), 'Tahan Lama', '4', 'Daya tahan lama'),
((SELECT id FROM kriteria WHERE kode = 'C3'), 'Cukup Tahan Lama', '3', 'Daya tahan cukup'),
((SELECT id FROM kriteria WHERE kode = 'C3'), 'Kurang Tahan Lama', '2', 'Daya tahan kurang'),
((SELECT id FROM kriteria WHERE kode = 'C3'), 'Tidak Tahan Lama', '1', 'Daya tahan rendah');

-- C4 - Daya Sebar (Spreading Power)
INSERT INTO sub_kriteria (kriteria_id, nama, bobot, keterangan) VALUES
((SELECT id FROM kriteria WHERE kode = 'C4'), '> 12 m²/Kg', '5', 'Daya sebar sangat baik'),
((SELECT id FROM kriteria WHERE kode = 'C4'), '10 - 12 m²/Kg', '4', 'Daya sebar baik'),
((SELECT id FROM kriteria WHERE kode = 'C4'), '8 - 10 m²/Kg', '3', 'Daya sebar cukup'),
((SELECT id FROM kriteria WHERE kode = 'C4'), '6 - 8 m²/Kg', '2', 'Daya sebar kurang'),
((SELECT id FROM kriteria WHERE kode = 'C4'), '< 6 m²/Kg', '1', 'Daya sebar rendah');

-- C5 - Waktu Pengeringan (Drying Time)
INSERT INTO sub_kriteria (kriteria_id, nama, bobot, keterangan) VALUES
((SELECT id FROM kriteria WHERE kode = 'C5'), '-+ 5 Jam', '1', 'Sangat buruk'),
((SELECT id FROM kriteria WHERE kode = 'C5'), '3 Jam', '2', 'Buruk'),
((SELECT id FROM kriteria WHERE kode = 'C5'), '1 jam - 2 Jam', '3', 'Cukup'),
((SELECT id FROM kriteria WHERE kode = 'C5'), '1 Jam', '4', 'Baik'),
((SELECT id FROM kriteria WHERE kode = 'C5'), '40 Menit - 1 Jam', '5', 'Sangat baik');

-- ========================================
-- PENILAIAN DATA (Assessment Matrix)
-- Based on research paper evaluation matrix
-- ========================================

-- A1 - Nippon Paint Vinilex: C1=5, C2=3, C3=3, C4=4, C5=4
INSERT INTO penilaian (alternatif_id, kriteria_id, sub_kriteria_id, nilai) VALUES
(
    (SELECT id FROM alternatif WHERE kode = 'A1'),
    (SELECT id FROM kriteria WHERE kode = 'C1'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C1') AND bobot = '5'),
    '5'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A1'),
    (SELECT id FROM kriteria WHERE kode = 'C2'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C2') AND bobot = '3'),
    '3'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A1'),
    (SELECT id FROM kriteria WHERE kode = 'C3'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C3') AND bobot = '3'),
    '3'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A1'),
    (SELECT id FROM kriteria WHERE kode = 'C4'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C4') AND bobot = '4'),
    '4'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A1'),
    (SELECT id FROM kriteria WHERE kode = 'C5'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C5') AND bobot = '4'),
    '4'
);

-- A2 - Aquaproof: C1=4, C2=2, C3=5, C4=1, C5=3
INSERT INTO penilaian (alternatif_id, kriteria_id, sub_kriteria_id, nilai) VALUES
(
    (SELECT id FROM alternatif WHERE kode = 'A2'),
    (SELECT id FROM kriteria WHERE kode = 'C1'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C1') AND bobot = '4'),
    '4'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A2'),
    (SELECT id FROM kriteria WHERE kode = 'C2'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C2') AND bobot = '2'),
    '2'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A2'),
    (SELECT id FROM kriteria WHERE kode = 'C3'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C3') AND bobot = '5'),
    '5'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A2'),
    (SELECT id FROM kriteria WHERE kode = 'C4'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C4') AND bobot = '1'),
    '1'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A2'),
    (SELECT id FROM kriteria WHERE kode = 'C5'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C5') AND bobot = '3'),
    '3'
);

-- A3 - Dulux Catylac: C1=3, C2=2, C3=3, C4=4, C6=5
INSERT INTO penilaian (alternatif_id, kriteria_id, sub_kriteria_id, nilai) VALUES
(
    (SELECT id FROM alternatif WHERE kode = 'A3'),
    (SELECT id FROM kriteria WHERE kode = 'C1'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C1') AND bobot = '3'),
    '3'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A3'),
    (SELECT id FROM kriteria WHERE kode = 'C2'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C2') AND bobot = '2'),
    '2'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A3'),
    (SELECT id FROM kriteria WHERE kode = 'C3'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C3') AND bobot = '3'),
    '3'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A3'),
    (SELECT id FROM kriteria WHERE kode = 'C4'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C4') AND bobot = '4'),
    '4'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A3'),
    (SELECT id FROM kriteria WHERE kode = 'C5'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C5') AND bobot = '5'),
    '5'
);

-- A4 - Mowilex Emulsion: C1=4, C2=3, C3=4, C4=5, C6=2
INSERT INTO penilaian (alternatif_id, kriteria_id, sub_kriteria_id, nilai) VALUES
(
    (SELECT id FROM alternatif WHERE kode = 'A4'),
    (SELECT id FROM kriteria WHERE kode = 'C1'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C1') AND bobot = '4'),
    '4'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A4'),
    (SELECT id FROM kriteria WHERE kode = 'C2'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C2') AND bobot = '3'),
    '3'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A4'),
    (SELECT id FROM kriteria WHERE kode = 'C3'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C3') AND bobot = '4'),
    '4'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A4'),
    (SELECT id FROM kriteria WHERE kode = 'C4'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C4') AND bobot = '5'),
    '5'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A4'),
    (SELECT id FROM kriteria WHERE kode = 'C5'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C5') AND bobot = '2'),
    '2'
);

-- A5 - No Drop: C1=4, C2=4, C3=3, C4=1, C6=3
INSERT INTO penilaian (alternatif_id, kriteria_id, sub_kriteria_id, nilai) VALUES
(
    (SELECT id FROM alternatif WHERE kode = 'A5'),
    (SELECT id FROM kriteria WHERE kode = 'C1'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C1') AND bobot = '4'),
    '4'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A5'),
    (SELECT id FROM kriteria WHERE kode = 'C2'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C2') AND bobot = '4'),
    '4'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A5'),
    (SELECT id FROM kriteria WHERE kode = 'C3'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C3') AND bobot = '3'),
    '3'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A5'),
    (SELECT id FROM kriteria WHERE kode = 'C4'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C4') AND bobot = '1'),
    '1'
),
(
    (SELECT id FROM alternatif WHERE kode = 'A5'),
    (SELECT id FROM kriteria WHERE kode = 'C5'),
    (SELECT id FROM sub_kriteria WHERE kriteria_id = (SELECT id FROM kriteria WHERE kode = 'C5') AND bobot = '3'),
    '3'
);
