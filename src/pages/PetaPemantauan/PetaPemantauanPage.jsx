import { useState, useEffect } from 'react';
import { Radio, AlertTriangle, Phone, Users } from 'lucide-react';
import ModernEmergencyMap from '../../components/ModernEmergencyMap';
import PageHeader from '../../components/global/PageHeader';
import Badge from '../../components/global/Badge';
import { adminService } from '../../api/services/adminService';
import { useNavigate } from 'react-router-dom';

export default function PetaPemantauanPage() {
  const navigate = useNavigate();
  const onOpenDetail = (id, type) => {
    if (type === 'relawan') navigate('/detail-relawan/' + id);
    else if (type === 'laporan') navigate('/detail-laporan/' + id);
    else navigate('/detail-kasus/' + id);
  };
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [mapData, setMapData] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [sireneLoading, setSireneLoading] = useState(false);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const res = await adminService.getPetaKasus();
        if (res && res.data) {
          const d = res.data;
          const mappedData = [];

          (d.titik_darurat_sos || []).forEach(t => {
            mappedData.push({
              id: t.id,
              displayId: t.id_kasus,
              type: 'sos',
              label: t.id_kasus,
              kategori: 'Darurat SOS (' + t.jenis_disabilitas + ')',
              prioritas: t.status === 'aktif' ? 'DARURAT' : 'Ditangani',
              pelapor: t.korban,
              lokasi: 'Lokasi Darurat',
              status: t.status,
              relawan: t.relawan_penangan || 'Menunggu Penugasan',
              eta: '—',
              lat: t.latitude,
              lng: t.longitude,
              waktu: t.waktu_sos || 'Baru saja'
            });
          });

          (d.titik_laporan_aktif || []).forEach(l => {
            mappedData.push({
              id: l.id,
              displayId: l.id_laporan,
              type: 'laporan',
              label: l.id_laporan,
              kategori: l.kategori || 'Laporan Pengguna',
              prioritas: l.urgensi === 'sedang' ? 'Prioritas Sedang' : 'Rendah',
              pelapor: l.pelapor,
              lokasi: 'Lokasi Laporan',
              status: l.status,
              relawan: l.relawan_penangan || 'Menunggu Penugasan',
              eta: '—',
              lat: l.latitude,
              lng: l.longitude,
              waktu: l.waktu_laporan || 'Baru saja'
            });
          });

          const volList = d.posisi_relawan || [];
          volList.forEach(r => {
            mappedData.push({
              id: 'REL-' + r.id,
              type: 'relawan',
              label: r.nama,
              kategori: r.kompetensi || 'Relawan Siaga',
              prioritas: r.status === 'sedang_bertugas' ? 'Bertugas' : 'Siaga',
              pelapor: 'Unit Relawan',
              lokasi: r.lokasi_user || 'Area Terdekat',
              status: r.status === 'sedang_bertugas' ? 'Menuju Lokasi' : 'Siaga',
              relawan: r.nama,
              eta: '-',
              lat: r.latitude,
              lng: r.longitude,
              waktu: 'Real-time GPS'
            });
          });

          setMapData(mappedData);

          const colors = ['bg-[#0ea5e9]', 'bg-[#10b981]', 'bg-[#f59e0b]'];
          setVolunteers(volList.map((v, i) => ({
            id: v.id,
            nama: v.nama,
            peran: v.kompetensi,
            status: v.status === 'siaga' ? 'Online' : 'Bertugas',
            avatar: v.nama.substring(0, 2).toUpperCase(),
            avatarBg: colors[i % colors.length],
            jarak: 'GPS Aktif',
            eta: 'Tersedia',
            kontak: v.no_telp
          })));
        }
      } catch (err) {
        console.error('Gagal mengambil data peta:', err);
      }
    };
    fetchMapData();
  }, []);

  const handleSirene = async () => {
    try {
      setSireneLoading(true);
      await adminService.triggerSirenePosko();
      alert('Sirene berhasil dibunyikan di seluruh posko!');
    } catch (err) {
      alert('Gagal membunyikan sirene.');
    } finally {
      setSireneLoading(false);
    }
  };

  const sosCount = mapData.filter(d => d.type === 'sos').length;
  const relawanCount = mapData.filter(d => d.type === 'relawan').length;
  const laporanCount = mapData.filter(d => d.type === 'laporan').length;


  return (
    <div className="page-shell space-y-6 relative">
      <PageHeader 
        title="Peta Pemantauan Wilayah"
        description="Pemantauan geospasial real-time, koordinasi titik SOS, dan pelacakan unit relawan siaga."
        actions={
          <div className="flex items-center gap-2 bg-white border border-[#eaedf1] px-4 py-2 rounded-xl text-[12px] font-semibold text-slate-600 shadow-xs">
            <Radio size={14} className="text-emerald-600 animate-pulse" />
            <span className="whitespace-nowrap">Satelit Geospasial GPS Online (Akurasi 3m)</span>
          </div>
        }
      />

      {/* â”€â”€ Metric Summary Badges â”€â”€ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-[#eaedf1] rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-bold text-slate-400">SOS Aktif</span>
            <p className="text-[24px] font-black text-red-600 mt-1">{sosCount}</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        </div>

        <div className="bg-white border border-[#eaedf1] rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-bold text-slate-400">Relawan Aktif</span>
            <p className="text-[24px] font-black text-emerald-600 mt-1">{relawanCount}</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>

        <div className="bg-white border border-[#eaedf1] rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-bold text-slate-400">Laporan Pending</span>
            <p className="text-[24px] font-black text-amber-600 mt-1">{laporanCount}</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-amber-500" />
        </div>
      </div>

      {/* Mobile Toggle Panel Button */}
      <div className="xl:hidden">
        <button 
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="w-full btn-base btn-secondary justify-between text-[13px] h-12"
        >
          <div className="flex items-center gap-2">
            <Users size={16} className="text-emerald-600" />
            <span className="font-bold">Unit Relawan Siaga Terdekat</span>
          </div>
          <Badge variant="Online" isPill>{volunteers.length} Tersedia</Badge>
        </button>
      </div>

      {/* â”€â”€ Large Map Canvas with Dispatch Panel Layout â”€â”€ */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Main Command Center Map */}
        <div className="w-full">
          <ModernEmergencyMap
            height="560px"
            onOpenDetail={onOpenDetail}
            showFilterBar={true}
            showLegend={true}
            mapData={mapData}
          />
        </div>

        {/* Right Dispatch & Responders Panel */}
        <div className={`${isPanelOpen ? 'block' : 'hidden'} xl:block bg-white border border-[#eaedf1] rounded-2xl p-5 shadow-xs space-y-5`}>
          <div className="border-b border-slate-100 pb-3.5 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-slate-900">Unit Relawan Siaga Terdekat</h2>
            <Badge variant="Online" customColor="bg-emerald-50 text-emerald-700" isPill>Live GPS</Badge>
          </div>

          {/* Volunteer List */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {volunteers.map(vol => (
              <div
                key={vol.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-slate-300 transition-all cursor-pointer"
                onClick={() => setSelectedVolunteer(vol)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${vol.avatarBg} text-white`}>
                      {vol.avatar}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-900 leading-tight">{vol.nama}</p>
                      <p className="text-[11px] text-slate-400">{vol.peran}</p>
                    </div>
                  </div>
                  <Badge variant={vol.status === 'Bertugas' ? 'Sedang Bertugas' : 'Online'} isPill />
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span><strong>{vol.jarak}</strong> &middot; {vol.eta}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Menghubungi ${vol.nama} (${vol.kontak})`);
                    }}
                    className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Phone size={11} />
                    <span>Panggil</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Broadcast Alert Button */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={handleSirene}
              disabled={sireneLoading}
              className="btn-base btn-primary w-full text-[12px] h-10 disabled:opacity-50"
            >
              <AlertTriangle size={14} />
              <span>{sireneLoading ? 'Membunyikan Sirene...' : 'Bunyikan Sirene di Seluruh Posko'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


