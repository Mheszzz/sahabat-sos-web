import { useState, useEffect } from 'react';
import {
  LayoutDashboard, AlertTriangle, Clock, Map, Settings,
  ChevronRight, Siren, LogOut
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
  { id: 'kasus-aktif', label: 'Kasus Aktif', icon: AlertTriangle, badge: 6 },
  { id: 'riwayat', label: 'Riwayat Kasus', icon: Clock },
  { id: 'peta', label: 'Peta Pemantauan', icon: Map },
  { id: 'pengaturan', label: 'Pengaturan Sistem', icon: Settings },
];

export default function Sidebar({ activePage, onPageChange, isOpen, onToggle }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar - Acts as a normal flex child on desktop, fixed on mobile */}
      <aside
        className={`
          flex flex-col bg-[#062c26] w-64 flex-shrink-0 z-50
          fixed inset-y-0 left-0 transition-transform duration-300
          lg:static lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo Header */}
        <div className="px-5 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Siren className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Sahabat SOS</p>
              <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-widest leading-tight">Admin Dashboard</p>
            </div>
          </div>
          {/* Live indicator */}
          <div className="mt-3 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-emerald-400 text-[10px] font-medium">Sistem Aktif & Terhubung</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto sidebar-scroll py-4 px-3">
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Menu Utama</p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onPageChange(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-200 group cursor-pointer
                      ${isActive
                        ? 'bg-emerald-600/80 text-white shadow-md'
                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`} size={18} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight size={14} className="text-white/60" />}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6">
            <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Sistem</p>
            <div className="bg-[#0a3a32] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot"></div>
                <span className="text-white/60 text-xs">Status Server</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-[11px]">API Backend</span>
                  <span className="text-emerald-400 text-[11px] font-medium">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-[11px]">Socket.io</span>
                  <span className="text-emerald-400 text-[11px] font-medium">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-[11px]">GIS Service</span>
                  <span className="text-amber-400 text-[11px] font-medium">Standby</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Profile Card */}
        <div className="p-3 border-t border-white/10 flex-shrink-0">
          <div className="bg-[#0a3a32] rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow">
                  DW
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0a3a32] rounded-full"></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">Dimas Wibisono</p>
                <p className="text-emerald-400 text-[10px] truncate">Super Admin</p>
              </div>
              <button className="text-white/30 hover:text-white/70 transition-colors cursor-pointer">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
