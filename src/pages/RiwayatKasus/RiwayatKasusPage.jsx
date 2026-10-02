import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Calendar, Filter, ChevronLeft, ChevronRight, Eye, CheckCircle2, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { laporanService } from '../../api/services/laporanService';
import { adminService } from '../../api/services/adminService';

const ITEMS_PER_PAGE = 8;

function formatDateRow(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const placeholder_riwayatData = [
	{
		id: 'SOS-5016',
		tanggal: '06 Sep 2026, 22:14',
		kategori: 'Kecelakaan Lalu Lintas',
		pelapor: 'Budi Hartono',
		disabilitas: 'Tunanetra',
		lokasi: 'Jl. Gatot Subroto No.12, Jakarta Selatan',
		relawan: 'Agus Setiawan',
		durasi: '12 Menit',
		status: 'Selesai',
	},
	{
		id: 'SOS-5015',
		tanggal: '06 Sep 2026, 19:42',
		kategori: 'Disorientasi di Transportasi Publik',
		pelapor: 'Siti Rahayu',
		disabilitas: 'Rungu & Wicara',
		lokasi: 'Stasiun Gambir, Jakarta Pusat',
		relawan: 'Fitri Rahayu',
		durasi: '28 Menit',
		status: 'Selesai',
	},
	{
		id: 'SOS-5014',
		tanggal: '06 Sep 2026, 16:05',
		kategori: 'Aksesibilitas Buruk — Lift Rusak',
		pelapor: 'Joko Susanto',
		disabilitas: 'Daksa (Kursi Roda)',
		lokasi: 'MRT Lebak Bulus, Jakarta Selatan',
		relawan: 'Tri Handoko',
		durasi: '9 Menit',
		status: 'Selesai',
	},
	{
		id: 'SOS-5013',
		tanggal: '06 Sep 2026, 14:30',
		kategori: 'Serangan Panik di Ruang Publik',
		pelapor: 'Rina Wati',
		disabilitas: 'Psikososial',
		lokasi: 'Plaza Indonesia, Jakarta Pusat',
		relawan: 'Nia Kurniasih',
		durasi: '35 Menit',
		status: 'Selesai',
	},
	{
		id: 'SOS-5012',
		tanggal: '06 Sep 2026, 11:18',
		kategori: 'Laporan Tidak Valid',
		pelapor: 'Tidak Diketahui',
		disabilitas: '-',
		lokasi: 'Lokasi tidak terdeteksi',
		relawan: '-',
		durasi: '-',
		status: 'Dibatalkan',
	},
	{
		id: 'SOS-5011',
		tanggal: '06 Sep 2026, 09:55',
		kategori: 'Butuh Panduan Navigasi Bandara',
		pelapor: 'Arif Wicaksono',
		disabilitas: 'Tunanetra',
		lokasi: 'Bandara Soekarno-Hatta Terminal 3',
		relawan: 'Dwi Riskianto',
		durasi: '22 Menit',
		status: 'Selesai',
	},
	{
		id: 'SOS-5010',
		tanggal: '05 Sep 2026, 20:33',
		kategori: 'Kondisi Medis Mendadak',
		pelapor: 'Dian Purnama',
		disabilitas: 'Epilepsi',
		lokasi: 'Taman Monas, Jakarta Pusat',
		relawan: 'Budi Santoso',
		durasi: '18 Menit',
		status: 'Selesai',
	},
	{
		id: 'SOS-5009',
		tanggal: '05 Sep 2026, 17:10',
		kategori: 'Sinyal Palsu / Test Tombol',
		pelapor: 'Perangkat IoT-003',
		disabilitas: '-',
		lokasi: 'Bekasi Barat (Uji Coba Perangkat)',
		relawan: '-',
		durasi: '-',
		status: 'Dibatalkan',
	},
];

export default function RiwayatKasusPage() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('Semua');
	const [currentPage, setCurrentPage] = useState(1);
	const [riwayatData, setRiwayatData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchRiwayat = async () => {
			try {
				setLoading(true);
				setError('');
				const res = await laporanService.getLaporan();
				if (res && res.data) {
					const items = res.data?.data ?? res.data ?? [];
					const raw = Array.isArray(items) ? items : [];
					setRiwayatData(raw.map((k) => ({
						id: String(k.id),
						rawId: k.id,
						tanggal: formatDateRow(k.waktu_laporan),
						kategori: k.kategori_laporan || 'Laporan Darurat',
						pelapor: k.pengguna?.name || '—',
						disabilitas: k.pengguna?.kategori_user || '—',
						lokasi: k.lokasi_laporan || '—',
						relawan: k.relawan?.name || '—',
						durasi: '—',
						status: k.status === 'selesai' ? 'Selesai' : k.status === 'batal' ? 'Dibatalkan' : (k.status || '—'),
					})));
				}
			} catch (err) {
				setError('Gagal memuat riwayat kasus. Pastikan backend berjalan.');
				console.error(err);
				// Fallback ke dummy data agar UI tetap bisa digunakan
				setRiwayatData(placeholder_riwayatData);
			} finally {
				setLoading(false);
			}
		};
		fetchRiwayat();
	}, []);

	const filtered = riwayatData.filter((r) => {
		const matchStatus = statusFilter === 'Semua' || r.status === statusFilter;
		const q = search.toLowerCase();
		const matchSearch =
			!q ||
			r.id.toLowerCase().includes(q) ||
			r.kategori.toLowerCase().includes(q) ||
			r.pelapor.toLowerCase().includes(q) ||
			r.lokasi.toLowerCase().includes(q) ||
			r.relawan.toLowerCase().includes(q);
		return matchStatus && matchSearch;
	});

	const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
	const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

	const handleExport = async () => {
		try {
			const blob = await adminService.exportLaporanCsv();
			const url = window.URL.createObjectURL(new Blob([blob]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `Rekap_Laporan_Sahabat_SOS_${new Date().toISOString().slice(0, 10)}.csv`);
			document.body.appendChild(link);
			link.click();
			link.remove();
		} catch (err) {
			console.error('Gagal export CSV:', err);
			alert('Gagal mengekspor laporan. Silakan coba lagi.');
		}
	};

	return (
		<div className="page-shell space-y-6">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-[24px] font-extrabold tracking-[-0.04em] text-slate-900">
						Riwayat Kasus
					</h1>
					<p className="mt-1 text-[14px] font-medium text-slate-500">
						Lihat dan telusuri seluruh riwayat laporan dan penanganan insiden lampau.
					</p>
				</div>

				<button
					onClick={handleExport}
					className="btn-base btn-secondary text-[12px] h-9"
				>
					<Download size={13} />
					<span>Ekspor Laporan</span>
				</button>
			</div>

			<div className="rounded-[22px] border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<div className="relative w-full md:w-80">
						<Search
							size={15}
							className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
						/>
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Cari ID, pelapor, relawan, lokasi..."
							className="form-input h-10 pr-4 bg-[#f8fafc]"
							style={{ paddingLeft: '40px' }}
						/>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-[#f8fafc] px-3 text-[12px] font-semibold text-slate-600">
							<Calendar size={13} className="text-slate-400" />
							<select className="bg-transparent outline-none">
								<option value="30">30 Hari Terakhir</option>
								<option value="7">7 Hari Terakhir</option>
								<option value="90">3 Bulan Terakhir</option>
							</select>
						</div>

						<div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-[#f8fafc] px-3 text-[12px] font-semibold text-slate-600">
							<Filter size={13} className="text-slate-400" />
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="bg-transparent outline-none"
							>
								<option value="Semua">Semua Status</option>
								<option value="Selesai">Selesai</option>
								<option value="Dibatalkan">Dibatalkan</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			<div className="overflow-hidden rounded-[22px] border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
				<div className="table-responsive">
					<table className="data-table">
						<thead>
							<tr>
								<th>ID Kasus</th>
								<th>Tanggal & Waktu</th>
								<th>Kategori</th>
								<th>Pelapor</th>
								<th>Lokasi</th>
								<th>Relawan</th>
								<th>Status</th>
								<th>Durasi Respon</th>
								<th className="text-right">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{loading && (
								<tr>
									<td colSpan={9} className="text-center py-12">
										<div className="flex items-center justify-center gap-2 text-slate-500">
											<Loader2 size={16} className="animate-spin text-[#0b6f61]" />
											<span className="text-[13px] font-semibold">Memuat riwayat...</span>
										</div>
									</td>
								</tr>
							)}
							{!loading && error && (
								<tr>
									<td colSpan={9} className="text-center py-8">
										<div className="flex items-center justify-center gap-2 text-amber-600 text-[12px] font-semibold">
											<AlertTriangle size={14} />
											<span>{error} (Menampilkan data contoh)</span>
										</div>
									</td>
								</tr>
							)}
							{!loading && paginated.map((row) => (
								<tr key={row.id}>
									<td className="min-w-0">
										<span className="block text-[12px] font-extrabold text-slate-900 break-words">
											{row.id}
										</span>
									</td>

									<td className="min-w-0">
										<span className="block text-[12px] text-slate-500 break-words">
											{row.tanggal}
										</span>
									</td>

									<td className="min-w-0">
										<span className="block max-w-[180px] text-[13px] font-bold text-slate-800 break-words">
											{row.kategori}
										</span>
									</td>

									<td className="min-w-0">
										<div className="max-w-[170px]">
											<p className="text-[12px] font-semibold text-slate-800 break-words">
												{row.pelapor}
											</p>
											<p className="mt-0.5 text-[11px] text-slate-400 break-words">
												{row.disabilitas}
											</p>
										</div>
									</td>

									<td className="min-w-0">
										<span
											className="block max-w-[220px] text-[12px] text-slate-600 break-words"
											title={row.lokasi}
										>
											{row.lokasi}
										</span>
									</td>

									<td className="min-w-0">
										<span className="block text-[12px] font-medium text-slate-700 break-words">
											{row.relawan}
										</span>
									</td>

									<td className="min-w-0">
										<span
											className={`inline-flex max-w-[140px] items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold break-words ${
												row.status === 'Selesai'
													? 'bg-[#ecfdf5] text-[#15803d]'
													: 'bg-[#fef2f2] text-[#dc2626]'
											}`}
										>
											{row.status === 'Selesai' ? (
												<CheckCircle2 size={12} />
											) : (
												<XCircle size={12} />
											)}
											<span>{row.status}</span>
										</span>
									</td>

									<td className="min-w-0">
										<span className="block text-[12px] font-semibold text-slate-700 break-words">
											{row.durasi}
										</span>
									</td>

									<td className="text-right min-w-0">
										<button
											onClick={() => navigate(`/detail-kasus/${row.rawId || row.id}`)}
											className="btn-base btn-secondary h-8 rounded-lg px-2.5 text-[11px]"
										>
											<Eye size={12} />
											<span>Detail</span>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="flex items-center justify-between border-t border-[#f1f5f9] px-6 py-4 text-[12px] text-slate-500">
					<span>
						Menampilkan {paginated.length} dari {filtered.length} riwayat
					</span>
					<div className="flex items-center gap-1.5">
						<button
							onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
							disabled={currentPage === 1}
							className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 cursor-pointer"
						>
							<ChevronLeft size={14} />
						</button>
						{Array.from({ length: totalPages }, (_, i) => (
							<button
								key={i + 1}
								onClick={() => setCurrentPage(i + 1)}
								className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold cursor-pointer ${
									currentPage === i + 1 ? 'bg-[#006D77] text-white' : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
								}`}
							>
								{i + 1}
							</button>
						))}
						<button
							onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
							className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 cursor-pointer"
						>
							<ChevronRight size={14} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
