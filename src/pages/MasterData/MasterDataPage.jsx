import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Database, MessageSquare } from 'lucide-react';
import { masterDataService } from '../../api/services/masterDataService';

export default function MasterDataPage() {
  const [kategoriList, setKategoriList] = useState([]);
  const [pesanCepatList, setPesanCepatList] = useState([]);
  const [newKategori, setNewKategori] = useState('');
  const [newPesan, setNewPesan] = useState('');
  const [editKategoriId, setEditKategoriId] = useState(null);
  const [editKategoriNama, setEditKategoriNama] = useState('');
  const [editPesanId, setEditPesanId] = useState(null);
  const [editPesanText, setEditPesanText] = useState('');

  const fetchMasterData = async () => {
    try {
      const resKat = await masterDataService.getKategori();
      if (resKat?.data) setKategoriList(resKat.data);
      const resPes = await masterDataService.getPesanCepat();
      if (resPes?.data) setPesanCepatList(resPes.data);
    } catch (error) { console.error('Gagal mengambil master data:', error); }
  };

  useEffect(() => { fetchMasterData(); }, []);

  const handleAddKategori = async (e) => {
    e.preventDefault();
    if (!newKategori) return;
    try { await masterDataService.createKategori({ nama: newKategori }); setNewKategori(''); fetchMasterData(); } catch (error) { console.error(error); }
  };

  const handleDeleteKategori = async (id) => {
    if (!window.confirm('Hapus kategori ini?')) return;
    try { await masterDataService.deleteKategori(id); fetchMasterData(); } catch (error) { console.error(error); }
  };

  const handleSaveEditKategori = async (id) => {
    if (!editKategoriNama.trim()) return;
    try { await masterDataService.updateKategori(id, { nama: editKategoriNama }); setEditKategoriId(null); fetchMasterData(); } catch (error) { console.error(error); }
  };

  const handleAddPesan = async (e) => {
    e.preventDefault();
    if (!newPesan) return;
    try { await masterDataService.createPesanCepat({ pesan: newPesan }); setNewPesan(''); fetchMasterData(); } catch (error) { console.error(error); }
  };

  const handleDeletePesan = async (id) => {
    if (!window.confirm('Hapus pesan cepat ini?')) return;
    try { await masterDataService.deletePesanCepat(id); fetchMasterData(); } catch (error) { console.error(error); }
  };

  const handleSaveEditPesan = async (id) => {
    if (!editPesanText.trim()) return;
    try { await masterDataService.updatePesanCepat(id, { pesan: editPesanText }); setEditPesanId(null); fetchMasterData(); } catch (error) { console.error(error); }
  };

  return (
    <div className="page-shell space-y-6">
      <div>
        <h1 className="text-[24px] font-extrabold tracking-[-0.04em] text-slate-900">Master Data Laporan</h1>
        <p className="mt-1 text-[14px] font-medium text-slate-500">Kelola kategori laporan darurat dan pesan cepat yang tersedia untuk pengguna.</p>
      </div>

      {/* Kategori Laporan */}
      <div className="rounded-[22px] border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="border-b border-[#f1f5f9] pb-4 mb-5 flex items-center gap-2">
          <Database size={16} className="text-[#0b6f61]" />
          <div>
            <h2 className="text-[16px] font-bold text-slate-900">Kategori Laporan Darurat</h2>
            <p className="mt-0.5 text-[12px] text-slate-400">Kelola jenis-jenis keadaan darurat yang bisa dipilih oleh pengguna.</p>
          </div>
        </div>
        <form onSubmit={handleAddKategori} className="flex gap-2 mb-4">
          <input type="text" value={newKategori} onChange={e => setNewKategori(e.target.value)} placeholder="Tambah Kategori Baru..." className="form-input flex-1" />
          <button type="submit" className="btn-base btn-primary px-4"><Plus size={15} /> Tambah</button>
        </form>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {kategoriList.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50 gap-2">
              {editKategoriId === item.id ? (
                <>
                  <input type="text" value={editKategoriNama} onChange={e => setEditKategoriNama(e.target.value)} className="form-input flex-1 text-[13px] h-8" autoFocus onKeyDown={e => e.key === 'Enter' && handleSaveEditKategori(item.id)} />
                  <div className="flex gap-1 flex-shrink-0">
                    <button type="button" onClick={() => handleSaveEditKategori(item.id)} className="btn-base btn-primary text-[11px] h-7 px-2">Simpan</button>
                    <button type="button" onClick={() => setEditKategoriId(null)} className="btn-base btn-secondary text-[11px] h-7 px-2">Batal</button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-[13px] font-bold text-slate-700 flex-1">{item.nama}</span>
                  <div className="flex gap-1 flex-shrink-0">
                    <button type="button" onClick={() => { setEditKategoriId(item.id); setEditKategoriNama(item.nama); }} className="text-blue-500 hover:text-blue-700 p-1"><Edit2 size={13} /></button>
                    <button type="button" onClick={() => handleDeleteKategori(item.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={13} /></button>
                  </div>
                </>
              )}
            </div>
          ))}
          {kategoriList.length === 0 && <p className="text-center text-slate-400 text-[12px] py-4">Belum ada kategori.</p>}
        </div>
      </div>

      {/* Pesan Cepat */}
      <div className="rounded-[22px] border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="border-b border-[#f1f5f9] pb-4 mb-5 flex items-center gap-2">
          <MessageSquare size={16} className="text-[#0b6f61]" />
          <div>
            <h2 className="text-[16px] font-bold text-slate-900">Pesan Cepat (Quick Messages)</h2>
            <p className="mt-0.5 text-[12px] text-slate-400">Pesan darurat instan yang dapat dikirim oleh pengguna hanya dengan 1 tap.</p>
          </div>
        </div>
        <form onSubmit={handleAddPesan} className="flex gap-2 mb-4">
          <input type="text" value={newPesan} onChange={e => setNewPesan(e.target.value)} placeholder="Tambah Pesan Cepat Baru..." className="form-input flex-1" />
          <button type="submit" className="btn-base btn-primary px-4"><Plus size={15} /> Tambah</button>
        </form>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {pesanCepatList.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50 gap-2">
              {editPesanId === item.id ? (
                <>
                  <input type="text" value={editPesanText} onChange={e => setEditPesanText(e.target.value)} className="form-input flex-1 text-[13px] h-8" autoFocus onKeyDown={e => e.key === 'Enter' && handleSaveEditPesan(item.id)} />
                  <div className="flex gap-1 flex-shrink-0">
                    <button type="button" onClick={() => handleSaveEditPesan(item.id)} className="btn-base btn-primary text-[11px] h-7 px-2">Simpan</button>
                    <button type="button" onClick={() => setEditPesanId(null)} className="btn-base btn-secondary text-[11px] h-7 px-2">Batal</button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-[13px] font-bold text-slate-700 flex-1">{item.pesan}</span>
                  <div className="flex gap-1 flex-shrink-0">
                    <button type="button" onClick={() => { setEditPesanId(item.id); setEditPesanText(item.pesan); }} className="text-blue-500 hover:text-blue-700 p-1"><Edit2 size={13} /></button>
                    <button type="button" onClick={() => handleDeletePesan(item.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={13} /></button>
                  </div>
                </>
              )}
            </div>
          ))}
          {pesanCepatList.length === 0 && <p className="text-center text-slate-400 text-[12px] py-4">Belum ada pesan cepat.</p>}
        </div>
      </div>
    </div>
  );
}
