# 🔄 Panduan Penyesuaian API (Perubahan Status Laporan & SOS)

Dokumen ini berisi rangkuman perubahan *value* pada status Kasus Darurat (SOS) dan Laporan yang ada di database. **Tim Frontend (Web Dashboard & Mobile App)** perlu menyesuaikan parameter API atau pengecekan *conditional (if-else)* di sisi UI agar sinkron dengan backend yang baru.

---

## 1. 📌 Ringkasan Perubahan Status di Database

Perubahan nilai enum (konstanta baku) pada kolom `status_sos` di tabel `s_o_s` dan kolom `status` di tabel `laporan`:

| Tipe | Status Lama (Deprecated) | Status Baru (Saat ini) |
| :--- | :--- | :--- |
| **SOS / Laporan** | `aktif` | `belum ditangani` |
| **SOS / Laporan** | `proses` | `ditangani` |
| **SOS / Laporan** | `selesai` | `selesai` (TIDAK BERUBAH) |
| **SOS** | `batal` | `batal` (TIDAK BERUBAH) |

> **💡 Info Penting:** Backend sudah membuatkan *mapping backward compatibility*. Jadi apabila frontend *masih* mengirimkan payload `aktif` atau `proses`, backend tidak akan crash dan otomatis mengonversinya. **Namun, sangat direkomendasikan untuk segera mengubahnya di _source code_ frontend agar standar.**

---

## 2. 📡 Endpoint yang Terdampak (Payload Pengiriman)

Jika frontend (Admin / Relawan) melakukan aksi untuk mengubah status, sesuaikan *body request/payload JSON*-nya.

### A. Admin - Ubah Status Tugas Aktif
- **Endpoint:** `PATCH /api/tugas-aktif/{tipe}/{id}/status`
- **Tipe:** `sos` atau `laporan`
- **Payload Baru:**
  ```json
  {
    "status": "ditangani" // Sebelumnya: "proses"
  }
  ```

### B. Relawan - Ubah Status Penanganan SOS
- **Endpoint:** `PATCH /api/sos/{id}/status`
- **Payload Baru:**
  ```json
  {
    "status": "ditangani" // Sebelumnya: "proses"
  }
  ```

### C. Update Status Laporan (General)
- **Endpoint:** `PUT /api/laporan/{id}/status`
- **Payload Baru:**
  ```json
  {
    "status": "ditangani" // Sebelumnya: "proses"
  }
  ```

---

## 3. 🔍 Pengecekan Response (Data yang Diterima Frontend)

Jika frontend menggunakan data kembalian (response API) untuk menentukan warna label (Badge) atau *conditional rendering* logika UI, nilai yang diterima dari backend sekarang sudah berubah.

### A. List Tugas Aktif & Detail Kasus
- **Endpoint:** `GET /api/tugas-aktif`, `GET /api/tugas-aktif/sos`, `GET /api/tugas-aktif/laporan`
- **Perubahan JSON Response:**
  ```json
  {
    "status": "Belum Tertangani", // <-- Format readable untuk ditampilkan di UI (Berubah dari "Aktif")
    "status_raw": "belum ditangani", // <-- Value asli database. Cek if-else pakai field ini! (Berubah dari "aktif")
    "kategori": "SOS",
    ...
  }
  ```

### B. Dashboard Admin (Antrean Kasus & Peta)
- **Endpoint:** `GET /api/admin/dashboard`
- **Perubahan JSON Response:**
  Titik darurat dan antrean kasus (Live Queue) akan menampilkan nilai status yang baru.
  ```json
  "antrean_kasus": [
    {
      "status": "ditangani", // <-- Cek if(status === 'ditangani') untuk warna kuning/warning
      ...
    }
  ]
  ```

### C. Relawan & Pengguna (Active SOS)
- **Endpoint:** `GET /api/sos/active`, `GET /api/sos/active/relawan`, `GET /api/sos/relawan/tasks`
- **Catatan:** Cek logika di Mobile App untuk status penanganan relawan. Jika sebelumnya tertulis `if (sos.status_sos === 'proses')`, ganti menjadi `if (sos.status_sos === 'ditangani')`.

---

## 4. 🗂️ Filtering Query Parameter

Jika list API menggunakan parameter URL untuk mem-filter data berdasarkan status (contoh: tab filtering "Belum Tertangani" vs "Sedang Ditangani"), sesuaikan URL fetch-nya:

**Sebelumnya:** 
`GET /api/tugas-aktif?status=aktif`
`GET /api/tugas-aktif?status=proses`

**Sekarang Sebaiknya:**
`GET /api/tugas-aktif?status=belum ditangani`
`GET /api/tugas-aktif?status=ditangani`

*(Sekali lagi, jika API lama dipanggil, backend akan mengonversinya, tetapi mengubah query di frontend sangat dianjurkan).*
