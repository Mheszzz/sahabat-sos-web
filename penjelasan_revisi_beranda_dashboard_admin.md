# 📋 Rencana Revisi — Beranda Dashboard Admin
> File: `src/pages/dashboard/DashboardPage.jsx`
> Dibuat: 15 Oktober 2026
> Status: **Selesai Diimplementasikan (Fase 1, 2, 3, 4 Selesai)**

---

## ✅ Verifikasi Klaim Eksternal (Sebelum Plan)

### Klaim yang Diperiksa:
> _"Halaman peta admin belum me-listen event `.RelawanLocationUpdate`, sehingga peta tidak otomatis refresh real-time saat relawan kirim koordinat."_

### Hasil Pengecekan `PetaPemantauanPage.jsx` (baris 114–119):

```js
const channel = echo.channel('command-center');
channel.listen('.RelawanLocationUpdate', () => fetchMapData()); // ✅ ADA di baris 115
channel.listen('.RelawanStatusUpdated', () => fetchMapData());
channel.listen('.SOSCreated', () => fetchMapData());
channel.listen('.SOSUpdateStatus', () => fetchMapData());
channel.listen('.LaporanCreated', () => fetchMapData());
```

### ✅ Kesimpulan: **KLAIM TIDAK AKURAT / SUDAH DIPERBAIKI**
- `PetaPemantauanPage.jsx` **sudah** me-listen `.RelawanLocationUpdate` di baris 115.
- Tidak perlu dimasukkan ke dalam plan revisi karena sudah beres.
- Kemungkinan klaim ini berasal dari versi lama kode yang sudah diperbarui.

> ⚠️ **Catatan untuk Developer:** Pastikan cek kembali versi terbaru di git sebelum mengerjakan apapun. Jangan berasumsi berdasarkan laporan lama.

---

## 🔍 Ringkasan Temuan Hardcode di `DashboardPage.jsx`

Semua data berikut **sudah memiliki sumber API**, namun masih menggunakan nilai statis/palsu sebagai initial state atau fallback.

---

### 1. 🔴 Initial State KPI — Angka Palsu (Baris 26–33)

```js
const [stats, setStats] = useState({
  kasusHariIni: 12,       // ← palsu
  kasusTrend: '+8%',      // ← palsu
  daruratSosAktif: 1,     // ← palsu
  laporanAktif: 3,        // ← palsu
  relawanAktif: 18,       // ← palsu
  totalKasusMingguan: 18, // ← palsu
});
```

**Sumber API tersedia:** `adminService.getDashboardStats()` → `d.kpi.*`

**Masalah:** Angka palsu ini tampil sebentar ke user sebelum data API masuk (flash of fake data). Jika API gagal, angka palsu ini tetap tampil seolah data asli.

---

### 2. 🔴 Fallback KPI Masih Pakai Angka Palsu (Baris 99–102)

```js
kasusHariIni: totalToday > 0 ? totalToday : 12,  // ← fallback ke 12
kasusTrend: d.kpi?.panggilan_sos_hari_ini?.tren || '+8%', // ← fallback ke '+8%'
daruratSosAktif: d.kpi?.darurat_sos_aktif?.total ?? 1,    // ← fallback ke 1
relawanAktif: d.kpi?.relawan_siaga_aktif?.siaga_bebas || ... || 18, // ← fallback ke 18
```

**Masalah:** Jika API mengembalikan `0` (memang tidak ada kasus), kode di baris 99 justru menampilkan `12` (palsu). Ini logika yang salah.

---

### 3. 🔴 Initial State Counter Peta — Angka Palsu (Baris 37–38)

```js
const [relawanCount, setRelawanCount] = useState(3); // ← palsu
const [sosCount, setSosCount] = useState(1);          // ← palsu
```

**Sumber API tersedia:** `adminService.getPetaKasus()` → `summary.total_relawan_siaga_bebas`, `summary.total_sos_aktif`

---

### 4. 🔴 Seluruh Data Grafik Mingguan Palsu — Initial State (Baris 52–65)

```js
const [weeklyChartData, setWeeklyChartData] = useState({
  totalKasus: 18,
  rataRataHarian: 2.6,
  puncakInsiden: { hari: 'Sabtu', total: 5 },
  harian: [
    { day: 'Min', count: 1 }, { day: 'Sen', count: 3 },
    { day: 'Sel', count: 2 }, { day: 'Rab', count: 4 },
    { day: 'Kam', count: 1 }, { day: 'Jum', count: 2 },
    { day: 'Sab', count: 5, isPeak: true },
  ],
});
```

**Sumber API tersedia:** `adminService.getGrafikSos()` → `g.harian`, `g.total_kasus`, `g.rata_rata_harian`, `g.puncak_insiden`

---

### 5. 🔴 Seluruh Kategori Statistik Palsu — Initial State (Baris 44–49)

```js
const [categoryStats, setCategoryStats] = useState([
  { label: 'Kondisi Medis',    count: 4, color: '#f43f5e' },
  { label: 'Butuh Pendamping', count: 3, color: '#10b981' },
  { label: 'Tersesat',         count: 2, color: '#3b82f6' },
  { label: 'Darurat SOS',      count: 2, color: '#dc2626' },
]);
```

**Sumber API tersedia:** `adminService.getSebaranUrgensi()` → `sebaran_kategori_laporan`

---

### 6. 🔴 Data Mock Kasus — Orang & Nomor Fiktif (Baris 258–272)

```js
const getDefaultCases = () => [{
  id: 4,
  pelapor: 'Ahmad Fauzi',         // ← orang fiktif
  kontak: '0812-3456-7890',       // ← nomor fiktif
  kontakWa: '6281234567890',      // ← nomor fiktif
  rawDate: '2026-10-10T14:20:00Z' // ← tanggal fiktif
}];
```

**Masalah:** Ditampilkan ketika API gagal (`catch` block baris 234). User melihat data palsu yang tampak asli.

---

### 7. 🔴 Fallback Nama & Nomor Palsu di Data Kasus (Baris 220–222)

```js
pelapor: s.pelapor?.name || 'Ahmad Fauzi',        // ← nama palsu
kontak:  s.pelapor?.no_telp || '0812-3456-7890',  // ← nomor palsu
kontakWa: s.pelapor?.no_telp_wa || '6281234567890', // ← nomor palsu
```

**Masalah:** Jika field API kosong, user melihat "Ahmad Fauzi" dengan nomor palsu, seolah data nyata.

---

### 8. 🟡 Fallback Tanggal Fiktif di `formatWaktu()` (Baris 242, 253)

```js
if (!dateStr) return '10 Okt • 14:20 WIB';  // ← tanggal fiktif
// ...
catch { return '10 Okt • 14:20 WIB'; }      // ← tanggal fiktif
```

**Masalah:** Tanggal palsu dengan hari dan jam spesifik tampil seolah waktu kejadian yang nyata.

---

### 9. 🟡 Lokasi Marker Peta Hardcoded (Baris 122, 138, 154)

```js
lokasi: 'Kawasan Kota Yogyakarta', // ← semua titik SOS sama
lokasi: 'Area D.I. Yogyakarta',    // ← semua titik laporan sama
lokasi: 'Area Siaga',              // ← jika rel.lokasi_user kosong
```

**Seharusnya:** Ambil dari `sos.alamat` / `lap.alamat`, jika kosong tampil `'-'`.

---

### 10. 🟡 Sub-stats Bawah Tidak Terhubung ke Data (Baris 620, 624)

```jsx
<span>Ancaman Bahaya: 1 kasus</span>  {/* ← statis, tidak dari data */}
<span>Lainnya: 0 kasus</span>          {/* ← statis, tidak dari data */}
```

**Seharusnya:** Dihitung dari `categoryStats` secara dinamis.

---

### 11. 🟡 Magic Number dan Label Fallback Tersebar

| Baris | Kode | Masalah |
|-------|------|---------|
| 134 | `lap.kategori \|\| 'Medis'` | Fallback kategori palsu |
| 136 | `lap.kategori \|\| 'Laporan'` | Fallback kategori palsu |
| 152 | `rel.kompetensi \|\| 'Relawan Lapangan'` | Fallback kompetensi |
| 218 | `s.sub_judul \|\| 'Darurat SOS'` | Fallback kategori (ini masih OK) |
| 297 | `'Relawan Lapangan'` (websocket handler) | Duplikat fallback |
| 607 | `(item.count / 5) * 100` | Angka `5` sebagai max bar palsu |
| 515 | `\|\| 'Sabtu'`, `\|\| 5` | Fallback puncak insiden hardcoded |

---

### 12. 🟢 Warna Hex Inline (Tidak Dari Theme)

Color palette yang sama ditulis **dua kali** di file ini (baris 172 dan 357):
```js
const colorPalette = ['#f43f5e', '#10b981', '#3b82f6', '#dc2626', '#f59e0b', '#8b5cf6'];
```

Warna brand juga langsung di JSX:
- `text-[#0b6f61]` (baris 679) — tombol detail
- `bg-[#0b6f61]`, `hover:bg-[#095c52]` (baris 741) — tombol aksi
- `text-[#dc2626]` (baris 475, 688) — badge merah
- `bg-[#ecfdf5]`, `text-[#065f46]` (baris 720) — tombol hubungi

**Seharusnya:** Referensi dari `src/utils/theme.js` yang sudah ada.

---

## 🗂️ Plan Pengerjaan Revisi

> **Urutan dikerjakan dari yang paling berdampak ke user terlebih dahulu.**

---

### FASE 1 — Perbaikan Kritis (Data Palsu yang Tampil ke User)

#### Task 1.1 — Ubah Semua Initial State Menjadi Null/Kosong
**File:** `DashboardPage.jsx`
**Baris:** 26–65

```js
// Ubah dari:
const [stats, setStats] = useState({ kasusHariIni: 12, ... });
const [weeklyChartData, setWeeklyChartData] = useState({ totalKasus: 18, ... });
const [categoryStats, setCategoryStats] = useState([{ label: 'Kondisi Medis', ... }]);
const [relawanCount, setRelawanCount] = useState(3);
const [sosCount, setSosCount] = useState(1);

// Menjadi:
const [stats, setStats] = useState(null);
const [weeklyChartData, setWeeklyChartData] = useState(null);
const [categoryStats, setCategoryStats] = useState([]);
const [relawanCount, setRelawanCount] = useState(0);
const [sosCount, setSosCount] = useState(0);
```

**Catatan penting:** Setelah ini, perlu tambahkan kondisi loading/skeleton di JSX agar UI tidak crash saat data null.

---

#### Task 1.2 — Perbaiki Logika Fallback KPI yang Salah
**File:** `DashboardPage.jsx`
**Baris:** 99–102

```js
// Ubah dari:
kasusHariIni: totalToday > 0 ? totalToday : 12,  // ← 0 kasus jadi 12!

// Menjadi:
kasusHariIni: totalToday,  // 0 = memang 0, tampilkan apa adanya
kasusTrend: d.kpi?.panggilan_sos_hari_ini?.tren || null,
daruratSosAktif: d.kpi?.darurat_sos_aktif?.total ?? 0,
relawanAktif: d.kpi?.relawan_siaga_aktif?.siaga_bebas ?? d.kpi?.relawan_siaga_aktif?.total_personel ?? 0,
```

---

#### Task 1.3 — Hapus `getDefaultCases()` dan Fallback Orang Fiktif
**File:** `DashboardPage.jsx`
**Baris:** 220–222, 258–272, 230, 234

```js
// Hapus seluruh fungsi getDefaultCases()
// Ubah fallback di catch menjadi:
} catch (err) {
  console.error('Error fetching dashboard data:', err);
  setCasesList([]); // kosongkan, tampilkan empty state
}

// Ubah fallback nama/nomor:
pelapor: s.pelapor?.name || '-',
kontak:  s.pelapor?.no_telp || '-',
kontakWa: s.pelapor?.no_telp_wa || s.pelapor?.no_telp || null,
```

---

#### Task 1.4 — Perbaiki `formatWaktu()` Agar Tidak Return Tanggal Palsu
**File:** `DashboardPage.jsx`
**Baris:** 242, 253

```js
// Ubah dari:
if (!dateStr) return '10 Okt • 14:20 WIB';
// ...
catch { return '10 Okt • 14:20 WIB'; }

// Menjadi:
if (!dateStr) return '-';
// ...
catch { return '-'; }
```

---

### FASE 2 — Perbaikan Data Dinamis (Lokasi & Sub-stats)

#### Task 2.1 — Perbaiki Lokasi Marker Peta
**File:** `DashboardPage.jsx`
**Baris:** 122, 138, 154

```js
// Ubah dari:
lokasi: 'Kawasan Kota Yogyakarta',

// Menjadi:
lokasi: sos.alamat || sos.lokasi_kejadian || '-',
```

Lakukan hal yang sama untuk laporan dan relawan.

---

#### Task 2.2 — Sub-stats "Ancaman Bahaya" Dibuat Dinamis
**File:** `DashboardPage.jsx`
**Baris:** 616–625

Sub-stats di bawah card kategori harus dihitung dari `categoryStats`:
```js
// Contoh: hitung dari data kategori yang ada
const ancamanCount = categoryStats.find(c =>
  c.label.toLowerCase().includes('bahaya') ||
  c.label.toLowerCase().includes('darurat')
)?.count ?? 0;

const lainnyaCount = categoryStats.find(c =>
  c.label.toLowerCase().includes('lainnya')
)?.count ?? 0;
```

> ⚠️ **Perlu konfirmasi ke backend:** Field apa yang dipakai untuk kategori "Ancaman Bahaya" dan "Lainnya" dari response API `getSebaranUrgensi()`?

---

#### Task 2.3 — Fallback Label Kategori Dirapikan
**Baris:** 134, 136

```js
// Ubah dari:
label: `${idKasus} ${lap.kategori || 'Medis'}`,
kategori: lap.kategori || 'Laporan',

// Menjadi:
label: `${idKasus}${lap.kategori ? ' • ' + lap.kategori : ''}`,
kategori: lap.kategori || '-',
```

---

### FASE 3 — Tambah Skeleton Loading UI

Karena initial state sekarang `null`/`[]`, perlu tambahkan skeleton agar UI tidak kosong atau crash saat loading pertama.

#### Task 3.1 — Skeleton untuk Card KPI
Saat `stats === null`, tampilkan skeleton di card "Kasus Hari Ini".

#### Task 3.2 — Skeleton untuk Chart Grafik Mingguan
Saat `weeklyChartData === null`, tampilkan placeholder bar chart.

#### Task 3.3 — Skeleton untuk Tabel Kasus
Saat `loading === true && casesList.length === 0`, tampilkan baris skeleton.

---

### FASE 4 — Refactor Warna & Magic Number (Opsional / Low Priority)

#### Task 4.1 — Sentralisasi Color Palette
```js
// Pindahkan ke src/utils/theme.js atau konstanta di atas komponen:
const CATEGORY_COLOR_PALETTE = ['#f43f5e', '#10b981', '#3b82f6', '#dc2626', '#f59e0b', '#8b5cf6'];
// Hapus duplikat di baris 172 dan 357
```

#### Task 4.2 — Ekstrak Magic Number ke Konstanta
```js
const PAGE_SIZE = 10;
const CHART_BAR_MIN_HEIGHT = 14;  // persen
const CHART_MAX_PROGRESS = 5;     // divisor progress bar
```

#### Task 4.3 — Ganti Warna Inline JSX ke Referensi Theme
Warna brand di JSX (`#0b6f61`, `#dc2626`, dll.) seharusnya menggunakan kelas Tailwind dari `tailwind.config.js` atau variabel CSS dari `theme.js`.

---

## 📌 Checklist Sebelum Mulai Pengerjaan

Sebelum mengerjakan revisi ini, konfirmasi hal-hal berikut:

| # | Pertanyaan | Perlu Konfirmasi |
|---|-----------|-----------------|
| 1 | Apakah `adminService.getDashboardStats()` sudah mengembalikan data `kpi.panggilan_sos_hari_ini.total` yang benar dari backend? | ✅ Cek response API live |
| 2 | Apakah `getGrafikSos()` sudah berjalan di backend dan mengembalikan 7 data harian? | ✅ Cek response API live |
| 3 | Apakah `getSebaranUrgensi()` mengembalikan field `kategori` yang konsisten dengan yang ditampilkan? | ✅ Cek nama field API |
| 4 | Field lokasi (`alamat` / `lokasi_kejadian`) untuk SOS dan laporan tersedia di response `getPetaKasus()`? | ✅ Cek struktur response |
| 5 | Apa label yang tepat untuk "Ancaman Bahaya" dan "Lainnya" di API `getSebaranUrgensi()`? | ✅ Konfirmasi ke backend |
| 6 | Apakah ada kondisi di mana `totalToday` memang benar `0` (tidak ada kasus hari ini)? Karena sekarang kode memaksa jadi `12`. | ✅ Pastikan logic benar |
| 7 | Apakah skeleton loading sudah ada komponen globalnya, atau perlu dibuat baru? | ✅ Cek `src/components/global/` |

---

## 🚫 Yang Sudah Terbukti TIDAK Perlu Direvisi

| Klaim | Status | Bukti |
|-------|--------|-------|
| "PetaPemantauanPage tidak listen `.RelawanLocationUpdate`" | ❌ Tidak akurat | Baris 115 `PetaPemantauanPage.jsx` sudah listen event ini |

---

## 📊 Estimasi Dampak Perbaikan

| Fase | Effort | Dampak ke User |
|------|--------|----------------|
| Fase 1 — Data palsu dihapus | Sedang (2–3 jam) | 🔴 Tinggi — user tidak lagi lihat data fiktif |
| Fase 2 — Data dinamis | Sedang (1–2 jam) | 🟡 Sedang — lokasi & sub-stats akurat |
| Fase 3 — Skeleton UI | Sedang (2–3 jam) | 🟡 Sedang — UX loading lebih baik |
| Fase 4 — Refactor warna | Rendah (1 jam) | 🟢 Rendah — maintainability |

---

## 📌 Update Revisi Terbaru (Permintaan Khusus User)

| # | Permintaan | Status | Detail Implementasi |
|---|------------|--------|---------------------|
| 1 | **Ubah judul "KONTAK DARURAT" menjadi "KONTAK PELAPOR"** | ✅ Selesai | Diubah di header tabel `DashboardPage.jsx` baris 756 |
| 2 | **Ganti judul "Grafik SOS Harian" menjadi "Grafik SOS pekan ini" & hapus subjudul "Tren SOS Mingguan"** | ✅ Selesai | Diperbarui di Card 1 `DashboardPage.jsx` |
| 3 | **Pecah "Kasus Hari Ini" menjadi 3 metrik: Hari Ini, Minggu Lalu, Bulan Lalu** | ✅ Selesai | Tampilan Card 2 diubah menjadi 3 kolom: **Hari Ini**, **Minggu Lalu**, dan **Bulan Lalu**. Backend `DashboardAdminController.php` telah ditambahkan kalkulasi query untuk `kasus_periode` (Hari Ini, Minggu Lalu via Carbon `subWeek()`, dan Bulan Lalu via `subMonth()`). |
| 4 | **Hapus tulisan tren "+100% dibanding kemarin" (Gambar 2)** | ✅ Selesai | Ikon dan teks persentase tren perbandingan kemarin telah dihapus sepenuhnya dari Card 2. |

---

*Dokumen ini dibuat berdasarkan audit kode pada 15 Oktober 2026 dan diperbarui setelah revisi diterapkan.*

