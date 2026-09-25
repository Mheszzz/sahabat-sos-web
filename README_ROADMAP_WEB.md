# 🚨 Sahabat SOS — Web Admin Command Center
## Panduan Pengembangan: UI/UX Refinement & Integrasi API

Dokumen ini adalah panduan kerja (*development roadmap*) terstruktur untuk menyempurnakan tampilan front-end (`sahabat-sos-web`) terlebih dahulu, kemudian mengintegrasikannya dengan API backend Laravel (`sahabat-sos-backend`).

---

## 📋 Daftar Isi
1. [Tech Stack & Lingkungan Pengembangan](#1-tech-stack--lingkungan-pengembangan)
2. [Prinsip Desain & UI/UX Guidelines](#2-prinsip-desain--uiux-guidelines)
3. [Alur Kerja (Roadmap): UI First → API Integration](#3-alur-kerja-roadmap-ui-first--api-integration)
   - [Fase 1: Audit & Penyempurnaan Tampilan (UI/UX)](#fase-1-audit--penyempurnaan-tampilan-uiux)
   - [Fase 2: Penyelarasan Mock Data Contract](#fase-2-penyelarasan-mock-data-contract)
   - [Fase 3: Integrasi API Backend Bertahap](#fase-3-integrasi-api-backend-bertahap)
   - [Fase 4: Real-Time Event (Laravel Reverb WebSocket)](#fase-4-real-time-event-laravel-reverb-websocket)
4. [Katalog Endpoint API Relevan](#4-katalog-endpoint-api-relevan)
5. [Daftar Periksa (Checklist) Harian](#5-daftar-periksa-checklist-harian)

---

## 1. Tech Stack & Lingkungan Pengembangan

| Bagian | Teknologi |
|---|---|
| **Framework Web** | React 19 + Vite |
| **Styling** | Tailwind CSS v4 |
| **Ikon** | Lucide React |
| **GIS Spasial** | Leaflet & OpenStreetMap |
| **HTTP Client** | Axios |
| **Real-time Client** | Laravel Echo & Pusher-js (menghubungkan ke Laravel Reverb) |
| **Linter** | Oxlint |

### Menjalankan Proyek:
```bash
# 1. Masuk ke direktori web
cd sahabat-sos-web

# 2. Instal dependensi
npm install

# 3. Jalankan server lokal
npm run dev
```

Pastikan file `.env` di `sahabat-sos-web` berisi:
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 2. Prinsip Desain & UI/UX Guidelines

Sesuai dokumen acuan *Command Center Tanggap Darurat*, antarmuka mengutamakan:
1. **Kecepatan Tindakan (*Speed-to-Dispatch*):** Admin harus bisa menugaskan relawan dalam maksimal 2 kali klik.
2. **Keterbacaan Kontras Tinggi:** Menggunakan kode warna status yang tegas untuk mengurangi beban kognitif operator di bawah tekanan darurat.
3. **Inklusif & Ramah Difabel:** Menampilkan profil disabilitas pelapor secara spesifik (Tunanetra, Tunarungu, Tunadaksa).

### Palet Warna Utama:
- **Warna Primer Posko:** `#0D4B3E` / `#053A2F` (*Deep Forest Green*)
- **Status Kritis (SOS Aktif):** `#E03131` / `#EF4444` (*Signal Red*)
- **Status Menunggu Alokasi:** `#D97706` / `#F59E0B` (*Amber/Warning*)
- **Status Sedang Ditangani:** `#2563EB` / `#3B82F6` (*Royal Blue*)
- **Status Selesai / Siaga:** `#059669` / `#10B981` (*Emerald Green*)
- **Latar Belakang Canvas:** `#F2F5F4` / `#F8FAFC`

---

## 3. Alur Kerja (Roadmap): UI First → API Integration

```
[Fase 1: Poles Tampilan & Interaksi UI]
                 │
                 ▼
[Fase 2: Penyelarasan Mock Data Contract]
                 │
                 ▼
[Fase 3: Integrasi API Backend Bertahap]
                 │
                 ▼
[Fase 4: Integrasi Real-Time WebSocket (Laravel Reverb)]
```

---

### Fase 1: Audit & Penyempurnaan Tampilan (UI/UX)
> **Tujuan:** Membuat seluruh komponen visual tampak profesional, responsif, dan interaktif dengan data tiruan (*mock*) sebelum menyentuh koneksi backend.

#### 1. Dashboard Utama (`src/pages/DashboardPage.jsx`)
- [ ] **4 Kartu Metrik KPI (`StatCard.jsx`):**
  - Panggilan SOS Hari Ini (dengan tren % vs kemarin).
  - Jumlah Laporan Masuk Hari Ini.
  - Kasus SOS Aktif (border merah peringatan tebal bila > 0).
  - Relawan Siaga Lapangan (rincian: siaga vs bertugas).
- [ ] **Antrean Kasus Darurat (`SOSCard.jsx`):**
  - Tampilkan ID Kasus (contoh `#SOS-12`), waktu relatif (*"3 menit lalu"*).
  - Badge disabilitas pelapor (Tunanetra, Tunarungu, dll.).
  - Tombol aksi instan: `Tugaskan Relawan` dan `Detail Kasus`.
- [ ] **Panel Peta Ringkas (`MapPanel.jsx`):**
  - Tampilkan titik darurat merah dan relawan siaga hijau.
- [ ] **Modul Relawan Siap Beroperasi (`VolunteerCard.jsx`):**
  - Nama relawan, kompetensi (P3K, Juru Bahasa Isyarat), dan status ketersediaan.
- [ ] **Analisis & Statistik (`DonutChart.jsx` & `ProgressBarChart.jsx`):**
  - Diagram sebaran disabilitas korban dan kategori laporan.

#### 2. Modal Quick Dispatch (Pop-up Penugasan Relawan)
- [ ] Buat komponen modal yang muncul saat tombol `Tugaskan Relawan` diklik.
- [ ] Menampilkan daftar 3–5 relawan terdekat dengan jarak radius (km) dan kompetensinya.
- [ ] Tombol konfirmasi `Tugaskan Sekarang` yang mengubah status kartu secara lokal (optimistic update).

#### 3. Kasus Aktif & Detail Kasus (`KasusAktifPage.jsx` & `DetailKasusPage.jsx`)
- [ ] Perbaiki filter tab (Semua, Darurat SOS, Sedang Ditangani, Selesai).
- [ ] Sempurnakan halaman rincian insiden: catatan medis korban, nomor darurat keluarga, dan info relawan penanggung jawab.

#### 4. Kerapihan State UI
- [ ] **Skeleton Loading:** Tampilan shimmer abu-abu saat data sedang dimuat (bukan hanya spinner kecil).
- [ ] **Empty State:** Tampilan visual saat tidak ada kasus aktif (contoh: ikon pelindung hijau dengan teks *"Semua situasi aman dan terkendali"*).

---

### Fase 2: Penyelarasan Mock Data Contract
> **Tujuan:** Menyesuaikan objek di `src/data/dummyData.js` agar sama persis (1:1) dengan response JSON backend, sehingga saat migrasi ke API asli, komponen tidak perlu dirombak.

Sesuaikan struktur data di `src/data/dummyData.js` mengikuti skema endpoint `GET /api/admin/dashboard`:
```json
{
  "kpi": {
    "panggilan_sos_hari_ini": { "total": 48, "tren": "+12%" },
    "jumlah_laporan_hari_ini": { "total": 15, "tren": "+8%" },
    "darurat_sos_aktif": { "total": 3, "is_kritis": true },
    "relawan_siaga_aktif": { "total_personel": 142, "siaga": 89, "sedang_bertugas": 53 }
  },
  "antrean_kasus": [
    {
      "id_kasus": "#SOS-12",
      "raw_id": 12,
      "tipe_kasus": "SOS",
      "waktu_relatif": "2 menit yang lalu",
      "lokasi": { "latitude": -6.2088, "longitude": 106.8456, "alamat": "Halte Astra" },
      "profil_korban": {
        "nama": "Ahmad",
        "no_telp": "08123456789",
        "jenis_disabilitas": "tunanetra",
        "catatan_medis": "Alergi obat penenang"
      },
      "alokasi_relawan": null,
      "status": "aktif"
    }
  ]
}
```

---

### Fase 3: Integrasi API Backend Bertahap
> **Tujuan:** Menghubungkan fungsi di folder `src/services/` ke endpoint Laravel backend satu per satu.

1. **Autentikasi Admin (`authService.js`):**
   - Hubungkan form login dengan endpoint `POST /api/auth/admin/login`.
   - Simpan token Sanctum ke `localStorage` (`admin_access_token`).
   - Sambungkan tombol logout ke `POST /api/logout`.
2. **Dashboard Utama (`adminService.js`):**
   - Ganti data mock `DashboardPage.jsx` dengan memanggil `GET /api/admin/dashboard`.
   - Simpan state KPI, antrean kasus, data peta GIS, dan analisis.
3. **Alokasi Relawan & Penyelesaian Kasus:**
   - Hubungkan modal penugasan dengan `GET /api/admin/dashboard/quick-dispatch?sos_id={id}`.
   - Panggil `POST /api/admin/dashboard/dispatch` untuk menetapkan relawan.
   - Panggil `PUT /api/admin/dashboard/sos/{id}/selesai` saat insiden selesai.
4. **Verifikasi Relawan:**
   - Sambungkan tabel verifikasi relawan ke `GET /api/admin/relawan/pending` dan `PUT /api/admin/relawan/{id}/verifikasi`.

---

### Fase 4: Real-Time Event (Laravel Reverb WebSocket)
> **Tujuan:** Antrean kasus dan titik di peta terupdate secara otomatis dan instan tanpa perlu memuat ulang (*refresh*) halaman browser.

- Instalasi Laravel Echo & Pusher-js:
  ```bash
  npm install laravel-echo pusher-js
  ```
- Dengarkan event dari backend:
  - Event `SOSCreated`: Putar suara sirine darurat dan tambahkan kasus baru ke puncak antrean.
  - Event `SOSUpdateStatus`: Ubah status kartu kasus secara otomatis saat relawan menerima atau menyelesaikan penanganan.

---

## 4. Katalog Endpoint API Relevan

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/admin/login` | Login khusus Admin & Superadmin (Web React) |
| `POST` | `/api/logout` | Logout & reset hak akses admin |
| `GET` | `/api/admin/dashboard` | Mengambil seluruh data KPI, antrean insiden, peta GIS, dan statistik |
| `GET` | `/api/admin/dashboard/quick-dispatch` | Ambil relawan terdekat berdasarkan ID kasus SOS |
| `POST` | `/api/admin/dashboard/dispatch` | Tugaskan relawan ke kasus SOS (`sos_id`, `relawan_id`) |
| `PUT` | `/api/admin/dashboard/sos/{id}/selesai` | Tandai kasus SOS selesai |
| `GET` | `/api/admin/dashboard/search?q={query}` | Pencarian global ⌘K |
| `GET` | `/api/admin/relawan/pending` | Daftar pendaftaran relawan yang belum diverifikasi |
| `PUT` | `/api/admin/relawan/{id}/verifikasi` | Verifikasi status relawan (`terverifikasi` / `ditolak`) |
| `GET` | `/api/laporan` | Daftar laporan masyarakat (paginated) |
| `PUT` | `/api/laporan/{id}/status` | Update status laporan masyarakat |

---

## 5. Daftar Periksa (Checklist) Harian

- [ ] **Hari 1:** Tinjau dan rapikan komponen di `DashboardPage.jsx` (`StatCard`, `SOSCard`, dan `MapPanel`).
- [ ] **Hari 2:** Buat modal interaktif `Quick Dispatch` untuk penugasan relawan terdekat.
- [ ] **Hari 3:** Sempurnakan `KasusAktifPage.jsx`, `DetailKasusPage.jsx`, serta lengkapi state Skeleton Loading & Empty State.
- [ ] **Hari 4:** Selaraskan format `dummyData.js` dengan response endpoint `GET /api/admin/dashboard`.
- [ ] **Hari 5:** Mulai integrasi API: Login (`authService`), lalu sambungkan data `DashboardPage`.
- [ ] **Hari 6:** Integrasi aksi `dispatch` relawan, `selesai` kasus, dan verifikasi relawan pending.
- [ ] **Hari 7:** Pasang koneksi WebSocket Laravel Reverb untuk notifikasi real-time dan alarm sirine.
