import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Calendar, Filter, ChevronLeft, ChevronRight, Eye, CheckCircle2, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { kasusAktifService } from '../../api/services/kasusAktifService';
import { adminService } from '../../api/services/adminService';
import CustomSelect from '../../components/global/CustomSelect';

const ITEMS_PER_PAGE = 8;

function formatDateRow(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function RiwayatKasusPage() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('Semua');
	const [dateFilter, setDateFilter] = useState('30');
	const [currentPage, setCurrentPage] = useState(1);
	const [riwayatData, setRiwayatData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchRiwayat = async () => {
			try {
				setLoading(true);
				setError('');
				const res = await kasusAktifService.getRiwayatAdmin();
				// Response: { data: { laporan: { data: [...] }, sos: { data: [...] } } }
				const d = res?.data ?? {};

				const laporanItems = d.laporan?.data ?? (Array.isArray(d.laporan) ? d.laporan : []);
				const sosItems     = d.sos?.data     ?? (Array.isArray(d.sos)     ? d.sos     : []);

				// Map transformItem fields dari KasusAktifController:
				// { id, status, status_raw, kategori ('SOS'|'Laporan'), jenis_laporan,
				//   pelapor.name, relawan.name, lokasi.alamat, waktu }
				const mapItem = (k, tipeKategori) => ({
					id: String(k.id),
					rawId: k.id,
					tipe: tipeKategori,
					tanggal: formatDateRow(k.waktu ?? k.updated_at ?? k.created_at),
					kategori: k.jenis_laporan ?? k.sub_judul ?? (tipeKategori === 'SOS' ? 'Darurat SOS' : 'Laporan'),
					pelapor: k.pelapor?.name ?? k.pengguna?.name ?? '—',
					disabilitas: k.pelapor?.kategori_user ?? k.pengguna?.kategori_user ?? '—',
					lokasi: k.lokasi?.alamat ?? k.lokasi_laporan ?? '—',
					relawan: k.relawan?.name ?? '—',
					status:
						(k.status_raw ?? k.status) === 'selesai' ? 'Selesai'
						: (k.status_raw ?? k.status) === 'batal'   ? 'Dibatalkan'
						: (k.status ?? '—'),
				});

				const mappedData = [
					...sosItems.map(k => mapItem(k, 'SOS')),
					...laporanItems.map(k => mapItem(k, 'Laporan')),
				];
				if (mappedData.length > 0) {
					setRiwayatData(mappedData);
				}
			} catch (err) {
				setError('Gagal memuat riwayat kasus. Pastikan backend berjalan.');
				console.error(err);
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
						<CustomSelect
							value={dateFilter}
							onChange={setDateFilter}
							options={[
								{ value: '30', label: '30 Hari Terakhir' },
								{ value: '7', label: '7 Hari Terakhir' },
								{ value: '90', label: '3 Bulan Terakhir' },
							]}
							placeholder="Rentang Waktu"
							icon={<Calendar size={13} />}
							menuWidth="w-48"
						/>

						<CustomSelect
							value={statusFilter}
							onChange={setStatusFilter}
							options={[
								{ value: 'Semua', label: 'Semua Status' },
								{ value: 'Selesai', label: 'Selesai' },
								{ value: 'Dibatalkan', label: 'Dibatalkan' },
							]}
							placeholder="Semua Status"
							icon={<Filter size={13} />}
							menuWidth="w-44"
						/>
					</div>
				</div>
			</div>

			<div className="overflow-hidden rounded-[22px] border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
				<div className="table-responsive">
					<table className="data-table">
						<thead>
							<tr>
								<th style={{width: '60px', minWidth: '60px'}}>ID</th>
								<th style={{minWidth: '130px'}}>Tanggal & Waktu</th>
								<th style={{minWidth: '140px'}}>Kategori</th>
								<th style={{minWidth: '160px'}}>Pelapor</th>
								<th style={{minWidth: '200px'}}>Lokasi</th>
								<th style={{minWidth: '140px'}}>Relawan</th>
								<th style={{minWidth: '130px'}}>Status</th>
								<th style={{width: '100px', minWidth: '100px'}} className="text-center">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{loading && (
								<tr>
									<td colSpan={8} className="text-center py-12">
										<div className="flex items-center justify-center gap-2 text-slate-500">
											<Loader2 size={16} className="animate-spin text-[#0b6f61]" />
											<span className="text-[13px] font-semibold">Memuat riwayat...</span>
										</div>
									</td>
								</tr>
							)}
							{!loading && error && (
								<tr>
									<td colSpan={8} className="text-center py-8">
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
											className={`inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-1.5 text-[11px] font-bold whitespace-nowrap ${
												row.status === 'Selesai'
													? 'bg-[#ecfdf5] text-[#15803d] border border-[#d1fae5]'
													: 'bg-[#fef2f2] text-[#dc2626] border border-[#fee2e2]'
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

									<td className="text-center min-w-0">
										<button
											onClick={() => navigate(`/detail-kasus/${row.rawId || row.id}?tipe=${row.tipe === 'SOS' ? 'sos' : 'laporan'}`)}
											className="btn-base btn-secondary h-8 rounded-lg px-2.5 text-[11px] inline-flex items-center justify-center gap-1.5"
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
