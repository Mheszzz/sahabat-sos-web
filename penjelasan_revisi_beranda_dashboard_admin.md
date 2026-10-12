# Penjelasan Detail Revisi Beranda (Dashboard Admin)

Dokumen ini menjelaskan struktur dan fungsi dari setiap komponen pada desain antarmuka "Dashboard Admin" terbaru, diurutkan dari bagian paling atas hingga bagian tabel di bawah.

## 1. Bagian Header (Judul & Sub-judul)
Bagian ini memberikan konteks langsung kepada pengguna mengenai fungsi halaman yang sedang dibuka.
*   **Judul Utama:** **"Dashboard Admin"** - Menunjukkan peran pengguna saat ini.

## 2. Kolom Kiri: Peta Pemantauan Wilayah (Real-time Command Center)
Ini adalah visualisasi utama untuk memantau lokasi secara geografis.
*   **Header Peta:** Menampilkan judul "Peta Pemantauan Wilayah — Real-time Command Center" beserta keterangan cakupan wilayah (Yogyakarta & Sekitarnya). Terdapat juga tombol *toggle* untuk mengubah tampilan peta (Peta Jalan / Satelit) dan tombol cepat untuk melihat "3 Relawan Terdekat".
*   **Area Peta Interaktif:** Menampilkan titik lokasi (pin) dengan penanda warna dan ikon:
    *   **Merah:** Menandakan keadaan darurat/SOS (contoh: #SOS-4 • Malioboro).
    *   **Kuning:** Menandakan laporan insiden (contoh: #5 Medis).
    *   **Hijau:** Menandakan lokasi relawan siaga beserta nama dan jaraknya (contoh: Dimas P, Rian H).
*   **Kontrol Zoom:** Tombol `+` dan `-` di sudut kanan atas peta untuk memperbesar/memperkecil tampilan peta.
*   **Legenda & Status Peta (Bagian Bawah):** Menjelaskan arti warna pin (Merah: SOS Aktif, Hijau: Relawan Siaga, Kuning: Laporan Pending) beserta jumlahnya. Terdapat juga keterangan bahwa pembaruan GPS bersifat real-time via satelit.

## 3. Kolom Kanan Atas: Kartu Ringkasan Informasi (Summary Cards)
Menampilkan metrik angka penting yang membutuhkan perhatian cepat.
*   **Kasus Hari Ini:** Menampilkan total jumlah laporan & SOS (angka besar "12"). Terdapat indikator tren positif warna hijau ("+8% dibanding kemarin") untuk analisis komparatif harian.
*   **Darurat SOS Aktif (Highlight Merah):** Didesain mencolok dengan outline dan teks merah, label "PRIORITAS TINGGI", dan ikon peringatan. Menampilkan angka "1" yang menandakan ada satu kasus yang butuh respons segera.
*   **Laporan Aktif & Relawan Aktif:** Dua kartu kecil berdampingan. Menampilkan jumlah laporan yang sedang ditangani tim ("3") dan jumlah relawan yang dalam status siaga ("18").

## 4. Kolom Kanan Bawah: Statistik & Grafik Analitik
Menyajikan data dalam bentuk visualisasi untuk melihat tren dan sebaran kasus.
*   **Sebaran Kategori Laporan:**
    *   Menampilkan *progress bar* untuk mengetahui kategori laporan terbanyak.
    *   Terdapat filter waktu ("Semua Waktu").
    *   Kategori yang ditampilkan meliputi: Kondisi Medis (4 kasus), Butuh Pendamping (3 kasus), Tersesat (2 kasus), dan Darurat SOS (2 kasus).
    *   Di bagian bawahnya terdapat teks ringkasan untuk ancaman bahaya dan lainnya.
*   **Grafik SOS Harian (Tren SOS Mingguan):**
    *   Menampilkan grafik batang (bar chart) yang menunjukkan jumlah kasus dari hari Minggu hingga Sabtu.
    *   Terdapat label total kasus ("18 Total Kasus").
    *   Di bagian bawah grafik terdapat *insight* otomatis, seperti hari dengan puncak insiden (contoh: Sabtu dengan 5 SOS) dan rata-rata kasus harian (2.6/hari).

## 5. Bagian Bawah: Tabel Manajemen Data (Kasus & Relawan)
Bagian ini digunakan untuk melihat detail data tabular dan melakukan tindakan operasional.
*   **Filter Cepat (Tabs):** Deretan tombol oval di kiri atas tabel untuk menyaring data berdasarkan kategori: "Semua (4)", "SOS (1)", "Laporan (3)", "Belum Ditangani (1)", "Sedang Ditangani (3)".
*   **Bilah Pencarian & Pengurutan:** Di kanan atas tabel, terdapat *search bar* (untuk mencari ID, pelapor, atau kategori), filter *dropdown* "Semua Kategori", dan opsi pengurutan data ("Terbaru").
*   **Kolom Tabel:** Data disusun dengan rapi menggunakan kolom berikut:
    *   **ID:** Nomor identifikasi tiket/kasus (contoh: #4, #5).
    *   **TIPE:** Label (badge) yang menunjukkan jenis kasus, apakah "SOS" (merah) atau "Laporan" (biru).
    *   **STATUS:** Status penanganan saat ini (contoh: "ditangani", "belum ditangani").
    *   **KATEGORI / INSIDEN:** Kategori spesifik dari insiden tersebut (contoh: Darurat, Kondisi Medis, Tersesat) beserta indikator warna.
    *   **PELAPOR:** Nama warga yang melaporkan kejadian.
    *   **KONTAK DARURAT:** Nomor telepon pelapor, dilengkapi dengan tombol "Hubungi" (warna hijau) untuk akses telepon cepat.
    *   **WAKTU:** Tanggal dan jam masuknya laporan (contoh: 10 Okt • 14:20 WIB).
    *   **AKSI:** Tombol "Detail" (warna hijau tua) untuk melihat informasi lengkap dari baris kasus tersebut.
*   **Pagination (Navigasi Halaman):** Di bagian paling bawah tabel, terdapat informasi jumlah baris yang ditampilkan ("Menampilkan 4 dari 4 kasus aktif saat ini") serta tombol navigasi "Sebelumnya", nomor halaman ("1"), dan "Selanjutnya".