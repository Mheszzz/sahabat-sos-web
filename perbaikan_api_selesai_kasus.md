# Panduan Perbaikan Error API "Selesai Kasus" (Frontend)

## 📌 Deskripsi Masalah
Saat menekan tombol **Selesaikan Kasus** di halaman Detail Kasus pada Dashboard Admin, muncul notifikasi error (toast):
`The route api/tugas-aktif/sos/1/selesai could not be found.`

## 🔍 Akar Masalah (Root Cause)
Frontend saat ini mencoba melakukan request ke URL:
`/api/tugas-aktif/sos/{id}/selesai`

Sedangkan di backend (Laravel), route tersebut **TIDAK ADA**. Route yang tersedia untuk menyelesaikan kasus di backend adalah:

1. `PATCH /api/tugas-aktif/{tipe}/{id}/status` (Untuk SOS & Laporan secara umum)
2. `PUT /api/admin/dashboard/sos/{id}/selesai` (Khusus untuk Dashboard Admin menyelesaikan SOS)

---

## 🛠️ Langkah Perbaikan (Action Plan)

Temukan file di dalam _source code_ frontend (React) yang menangani aksi tombol **"Selesaikan Kasus"** (biasanya di file komponen `DetailKasus.jsx`, `api.js`, atau yang berhubungan dengan _services/actions_). 

Pilih salah satu dari 2 opsi di bawah ini untuk memperbaiki URL-nya:

### Opsi 1 (Direkomendasikan) - Menggunakan Endpoint Status Universal
Ubah URL request dan method HTTP-nya menjadi seperti ini:
```javascript
// Method: PATCH
// URL: /api/tugas-aktif/{tipe}/{id}/status
// Body Request:

fetch(`/api/tugas-aktif/sos/${id}/status`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    status: 'selesai'
  })
})
```
> **Catatan:** Ganti kata `sos` pada URL menjadi `laporan` jika tipe kasusnya adalah laporan masyarakat biasa. Opsi ini lebih universal.

### Opsi 2 - Menggunakan Endpoint Khusus Admin
Jika halamannya memang khusus Admin dan tipe kasusnya selalu SOS, cukup ganti URL dan method-nya menjadi:
```javascript
// Method: PUT
// URL: /api/admin/dashboard/sos/{id}/selesai
// Body Request: (Kosong / Tidak Perlu)

fetch(`/api/admin/dashboard/sos/${id}/selesai`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

## ✅ Cara Verifikasi
1. _Save_ perubahan di frontend.
2. Coba klik lagi tombol **Selesaikan Kasus** di halaman Admin.
3. Pastikan tidak ada lagi toast merah `route could not be found` dan kasus berhasil pindah ke status Selesai.
