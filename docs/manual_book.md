# Manual Book
## Petunjuk Penggunaan Aplikasi

**SISTEM PENDUKUNG KEPUTUSAN PEMILIHAN CAT DINDING TERBAIK**  
**MENGGUNAKAN METODE WEIGHTED PRODUCT (WP)**  
**PADA TB RAJA BANGUNAN**

---

**Disusun Oleh:**  
AMELIA AZRA PAKAYA

**Program Studi Teknik Informatika**  
**Fakultas Teknik dan Ilmu Komputer**  
**2025**

---

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Persyaratan Sistem](#persyaratan-sistem)
3. [Instalasi dan Konfigurasi](#instalasi-dan-konfigurasi)
4. [Panduan Penggunaan](#panduan-penggunaan)
5. [Fitur-Fitur Aplikasi](#fitur-fitur-aplikasi)
6. [Troubleshooting](#troubleshooting)

---

## Pendahuluan

Aplikasi Sistem Pendukung Keputusan Pemilihan Cat Dinding Terbaik adalah sebuah aplikasi web berbasis Next.js yang menggunakan metode Weighted Product (WP) untuk membantu dalam pengambilan keputusan pemilihan cat dinding terbaik berdasarkan kriteria-kriteria yang telah ditentukan.

### Tujuan Aplikasi
- Membantu TB Raja Bangunan dalam menentukan cat dinding terbaik
- Menyediakan sistem penilaian yang objektif menggunakan metode ilmiah
- Menghasilkan peringkat alternatif cat dinding berdasarkan kriteria yang telah ditetapkan

### Metode yang Digunakan
Aplikasi ini menggunakan metode **Weighted Product (WP)** yang merupakan salah satu metode dalam sistem pendukung keputusan multi-kriteria (MCDM).

---

## Persyaratan Sistem

### Persyaratan Server
- **Bun** (JavaScript runtime & Package manager)
- **XAMPP** (Apache & MySQL)
- **Web Browser** modern (Chrome, Firefox, Edge, Safari)

### Persyaratan Hardware
- RAM minimal 4GB
- Storage minimal 2GB
- Koneksi internet untuk instalasi dependencies

---

## Instalasi dan Konfigurasi

### 1. Persiapan Database

#### a. Menjalankan XAMPP
1. Buka **XAMPP Control Panel**
2. Klik tombol **Start** pada:
   - **Apache** (untuk web server)
   - **MySQL** (untuk database server)

![XAMPP Control Panel](https://via.placeholder.com/600x300?text=XAMPP+Control+Panel)

#### b. Membuat Database
1. Buka browser dan akses `http://localhost/phpmyadmin/`
2. Klik tab **"Databases"**
3. Buat database baru dengan nama: `wp_amel`
4. Klik tombol **"Create"**

![phpMyAdmin Database Creation](https://via.placeholder.com/600x300?text=phpMyAdmin+Database+Creation)

#### c. Import Struktur Database
1. Pilih database `wp_amel` yang telah dibuat
2. Klik tab **"Import"**
3. Klik **"Choose File"** dan pilih file `database/seed.sql`
4. Klik **"Import"** untuk mengimpor struktur dan data awal

### 2. Instalasi Aplikasi

#### a. Persiapan Environment
1. Buka terminal/command prompt
2. Navigasi ke direktori project
3. Copy file `.env.example` menjadi `.env.local`
4. Edit file `.env.local` dan sesuaikan konfigurasi database:

```env
DATABASE_URL="mysql://root:@localhost:3306/wp_amel"
```

#### b. Instalasi Dependencies
```bash
# Install dependencies menggunakan Bun
bun install

# Generate database schema
bun run db:generate

# Migrate database
bun run db:migrate

# Seed database dengan data awal (opsional)
bun run db:seed
```

#### c. Menjalankan Aplikasi
```bash
# Mode development
bun run dev

# Mode production
bun run build
bun run start
```

### 3. Akses Aplikasi
Setelah berhasil dijalankan, aplikasi dapat diakses melalui:
- **URL:** `http://localhost:3000`
- **Admin Panel:** `http://localhost:3000/admin`

---

## Panduan Penggunaan

### 1. Tampilan Dashboard Utama

Dashboard utama menampilkan:
- **Statistik Data:** Jumlah alternatif, kriteria, sub kriteria, dan penilaian
- **Peringkat Hasil WP:** Tabel ranking hasil perhitungan Weighted Product
- **Rekomendasi Terbaik:** Cat dinding dengan skor tertinggi

![Dashboard Utama](https://via.placeholder.com/800x400?text=Dashboard+Utama)

### 2. Navigasi Menu

Aplikasi memiliki menu navigasi di sisi kiri dengan fitur-fitur:
- 🏠 **Dashboard**
- 📦 **Data Alternatif**
- 🎯 **Data Kriteria**
- 📋 **Data Sub Kriteria**
- ✅ **Data Penilaian**
- 🧮 **Data Perhitungan**
- 📊 **Laporan**

---

## Fitur-Fitur Aplikasi

### 1. Manajemen Data Alternatif

#### Fungsi:
Mengelola data merek cat dinding yang akan dievaluasi.

#### Cara Penggunaan:
1. Akses menu **"Data Alternatif"**
2. Klik tombol **"Tambah Alternatif"**
3. Isi form dengan data:
   - **Kode:** Kode unik alternatif (contoh: A001)
   - **Nama:** Nama merek cat (contoh: Dulux Weathershield)
   - **Jenis:** Pilih Interior atau Eksterior
4. Klik **"Simpan"**

#### Fitur Tambahan:
- **Edit Data:** Klik icon pensil untuk mengubah data
- **Hapus Data:** Klik icon sampah untuk menghapus data
- **Pencarian:** Gunakan kolom search untuk mencari data

![Data Alternatif](https://via.placeholder.com/800x400?text=Data+Alternatif)

### 2. Manajemen Data Kriteria

#### Fungsi:
Mengelola kriteria penilaian untuk evaluasi cat dinding.

#### Cara Penggunaan:
1. Akses menu **"Data Kriteria"**
2. Klik tombol **"Tambah Kriteria"**
3. Isi form dengan data:
   - **Kode:** Kode unik kriteria (contoh: C001)
   - **Nama:** Nama kriteria (contoh: Daya Tahan)
   - **Bobot:** Nilai bobot kriteria (0.00 - 1.00)
   - **Jenis:** Pilih Benefit (semakin besar semakin baik) atau Cost (semakin kecil semakin baik)
4. Klik **"Simpan"**

#### Contoh Kriteria:
- **C001 - Daya Tahan** (Bobot: 0.25, Jenis: Benefit)
- **C002 - Harga** (Bobot: 0.20, Jenis: Cost)
- **C003 - Kualitas Warna** (Bobot: 0.20, Jenis: Benefit)
- **C004 - Kemudahan Aplikasi** (Bobot: 0.15, Jenis: Benefit)
- **C005 - Ramah Lingkungan** (Bobot: 0.20, Jenis: Benefit)

![Data Kriteria](https://via.placeholder.com/800x400?text=Data+Kriteria)

### 3. Manajemen Data Sub Kriteria

#### Fungsi:
Mengelola sub kriteria sebagai detail penilaian dari setiap kriteria.

#### Cara Penggunaan:
1. Akses menu **"Data Sub Kriteria"**
2. Klik tombol **"Tambah Sub Kriteria"**
3. Isi form dengan data:
   - **Kriteria:** Pilih kriteria induk
   - **Nama:** Nama sub kriteria
   - **Bobot:** Nilai bobot sub kriteria
   - **Keterangan:** Deskripsi sub kriteria (opsional)
4. Klik **"Simpan"**

#### Contoh Sub Kriteria untuk "Daya Tahan":
- **Sangat Baik** (Bobot: 5) - Tahan lebih dari 8 tahun
- **Baik** (Bobot: 4) - Tahan 6-8 tahun
- **Cukup** (Bobot: 3) - Tahan 4-6 tahun
- **Kurang** (Bobot: 2) - Tahan 2-4 tahun
- **Sangat Kurang** (Bobot: 1) - Tahan kurang dari 2 tahun

![Data Sub Kriteria](https://via.placeholder.com/800x400?text=Data+Sub+Kriteria)

### 4. Manajemen Data Penilaian

#### Fungsi:
Melakukan penilaian setiap alternatif berdasarkan kriteria yang telah ditentukan.

#### Cara Penggunaan:
1. Akses menu **"Data Penilaian"**
2. Klik tombol **"Tambah Penilaian"**
3. Isi form dengan data:
   - **Alternatif:** Pilih merek cat yang akan dinilai
   - **Kriteria:** Pilih kriteria penilaian
   - **Sub Kriteria:** Pilih sub kriteria yang sesuai
   - **Nilai:** Nilai akan otomatis terisi berdasarkan bobot sub kriteria
4. Klik **"Simpan"**

#### Catatan Penting:
- Setiap alternatif harus dinilai untuk semua kriteria
- Penilaian yang tidak lengkap akan mempengaruhi hasil perhitungan

![Data Penilaian](https://via.placeholder.com/800x400?text=Data+Penilaian)

### 5. Data Perhitungan Weighted Product

#### Fungsi:
Melakukan perhitungan menggunakan metode Weighted Product dan menampilkan hasil ranking.

#### Cara Penggunaan:
1. Akses menu **"Data Perhitungan"**
2. Pastikan semua data alternatif, kriteria, dan penilaian sudah lengkap
3. Klik tombol **"Hitung WP"** untuk memulai perhitungan
4. Sistem akan menampilkan:
   - **Normalisasi Bobot:** Bobot kriteria yang telah dinormalisasi
   - **Nilai Vektor S:** Nilai preferensi relatif
   - **Nilai Vektor V:** Nilai preferensi global
   - **Ranking:** Peringkat alternatif dari terbaik hingga terburuk

#### Proses Perhitungan:
1. **Normalisasi Bobot Kriteria**
2. **Perhitungan Vektor S**
3. **Perhitungan Vektor V**
4. **Penentuan Ranking**

![Data Perhitungan](https://via.placeholder.com/800x400?text=Data+Perhitungan)

### 6. Sistem Laporan

#### Fungsi:
Menghasilkan laporan dalam berbagai format untuk dokumentasi dan analisis.

#### Jenis Laporan:
1. **Laporan Alternatif:** Daftar semua merek cat yang dievaluasi
2. **Laporan Kriteria:** Daftar kriteria dan bobotnya
3. **Laporan Sub Kriteria:** Detail sub kriteria untuk setiap kriteria
4. **Laporan Penilaian:** Matrix penilaian alternatif vs kriteria
5. **Laporan Hasil Nilai:** Hasil akhir perhitungan dan ranking

#### Cara Mencetak Laporan:
1. Akses menu **"Laporan"**
2. Pilih jenis laporan yang diinginkan
3. Klik tombol **"Print"** atau **"Cetak"**
4. Laporan akan dibuka di tab baru dan siap untuk dicetak

![Laporan](https://via.placeholder.com/800x400?text=Laporan)

---

## Alur Kerja Aplikasi

### 1. Persiapan Data
1. **Input Data Alternatif** - Masukkan semua merek cat yang akan dievaluasi
2. **Input Data Kriteria** - Tentukan kriteria penilaian dan bobotnya
3. **Input Data Sub Kriteria** - Buat skala penilaian untuk setiap kriteria

### 2. Proses Penilaian
1. **Input Data Penilaian** - Nilai setiap alternatif untuk semua kriteria
2. **Validasi Data** - Pastikan semua alternatif telah dinilai lengkap

### 3. Perhitungan dan Analisis
1. **Jalankan Perhitungan WP** - Sistem menghitung secara otomatis
2. **Review Hasil** - Analisis ranking dan nilai yang dihasilkan
3. **Generate Laporan** - Cetak laporan untuk dokumentasi

---

## Tips Penggunaan

### 1. Best Practices
- **Konsistensi Data:** Pastikan semua data terisi dengan konsisten
- **Bobot Kriteria:** Total bobot semua kriteria harus = 1.00
- **Backup Data:** Lakukan backup database secara berkala
- **Validasi Input:** Periksa kembali data sebelum melakukan perhitungan

### 2. Optimasi Performa
- **Tutup aplikasi lain** yang tidak diperlukan saat menggunakan aplikasi
- **Gunakan browser terbaru** untuk performa optimal
- **Bersihkan cache browser** jika mengalami masalah loading

---

## Troubleshooting

### 1. Masalah Database
**Problem:** Database tidak terhubung  
**Solusi:**
- Pastikan XAMPP MySQL sudah running
- Periksa konfigurasi di file `.env.local`
- Restart Apache dan MySQL di XAMPP

### 2. Masalah Loading Aplikasi
**Problem:** Aplikasi loading lama atau error  
**Solusi:**
- Periksa koneksi internet
- Refresh browser (Ctrl + F5)
- Clear browser cache
- Restart aplikasi dengan `bun run dev`

### 3. Masalah Perhitungan
**Problem:** Hasil perhitungan tidak muncul  
**Solusi:**
- Pastikan semua alternatif sudah dinilai untuk semua kriteria
- Periksa total bobot kriteria = 1.00
- Periksa log error di browser console (F12)

### 4. Masalah Print/Cetak
**Problem:** Laporan tidak bisa dicetak  
**Solusi:**
- Pastikan browser mendukung fungsi print
- Periksa pengaturan printer
- Coba gunakan browser lain
- Export ke PDF terlebih dahulu

---

## Kontak Support

Jika mengalami masalah yang tidak dapat diselesaikan dengan panduan ini, silakan hubungi:

**Tim Developer WP-AMEL**  
📧 Email: support@wp-amel.com  
📞 Phone: (021) 1234-5678  
🌐 Website: https://wp-amel.com

---

## Changelog

### Versi 1.0.0 (2025)
- ✅ Implementasi metode Weighted Product
- ✅ CRUD Data Alternatif, Kriteria, Sub Kriteria
- ✅ Sistem Penilaian dan Perhitungan
- ✅ Dashboard dan Laporan
- ✅ Responsive Design

---

**© 2025 WP-AMEL. All rights reserved.**