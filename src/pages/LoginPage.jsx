import { useState } from 'react';
import { Eye, EyeOff, Siren, AlertCircle, Loader2, ShieldCheck, Activity } from 'lucide-react';
import { authService } from '../services/authService';

// Shape yang nantinya bisa diisi dari API response
// { nama, email, role, avatar }
export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email dan kata sandi wajib diisi.');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      const user = {
        nama: data.user?.name || 'Admin',
        email: email,
        role: data.user?.role === 'superadmin' ? 'Super Admin' : 'Admin',
        id: data.user?.id,
      };
      onLoginSuccess(user);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'Email atau kata sandi tidak valid.';
      setError(msg);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div style={s.root}>
      {/* Left panel */}
      <div style={s.leftPanel}>
        <div style={s.leftTop}>
          <div style={s.logoWrap}>
            <div style={s.logoBox}>
              <Siren size={20} color="#fff" />
            </div>
            <div>
              <p style={s.brandName}>Sahabat SOS</p>
              <p style={s.brandSub}>Admin Dashboard</p>
            </div>
          </div>
          <span style={s.liveBadge}>
            <span style={s.liveDot} />
            Sistem Aktif
          </span>
        </div>

        <div style={s.leftBody}>
          <div style={s.leftIcon}>
            <ShieldCheck size={42} color="rgba(52,211,153,0.85)" />
          </div>
          <h2 style={s.leftTitle}>Panel Kontrol Pusat</h2>
          <p style={s.leftDesc}>
            Platform pemantauan dan tanggap darurat inklusif untuk penyandang disabilitas
            di seluruh wilayah Indonesia.
          </p>
          <div style={s.statGrid}>
            <div style={s.statCard}>
              <span style={s.statNum}>48</span>
              <span style={s.statLabel}>Laporan Aktif</span>
            </div>
            <div style={s.statCard}>
              <span style={s.statNum}>15</span>
              <span style={s.statLabel}>Sukarelawan</span>
            </div>
            <div style={s.statCard}>
              <span style={s.statNum}>142</span>
              <span style={s.statLabel}>Terselesaikan</span>
            </div>
          </div>
          <div style={s.statusRow}>
            <Activity size={13} color="#34d399" />
            <span style={s.statusText}>Semua layanan berjalan normal</span>
          </div>
        </div>

        <p style={s.leftFooter}>© 2026 Sahabat SOS — Inklusi &amp; Tanggap Darurat Difabel</p>
      </div>

      {/* Right panel */}
      <div style={s.rightPanel}>
        <div
          style={s.formCard}
          className={shake ? 'login-shake' : ''}
        >
          <div style={s.formHeader}>
            <h1 style={s.formTitle}>Masuk ke Akun Anda</h1>
            <p style={s.formSub}>Khusus akses Superadmin &amp; Administrator</p>
          </div>

          <form onSubmit={handleSubmit} noValidate style={s.form}>
            <div style={s.fieldGroup}>
              <label htmlFor="login-email" style={s.label}>Alamat Email</label>
              <input
                id="login-email"
                type="email"
                style={{ ...s.input, ...(error ? s.inputErr : {}) }}
                placeholder="contoh@sahabatsos.id"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                autoComplete="username"
                disabled={loading}
                className="login-input"
              />
            </div>

            <div style={s.fieldGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="login-password" style={s.label}>Kata Sandi</label>
                <button type="button" style={s.forgotBtn}>Lupa kata sandi?</button>
              </div>
              <div style={s.pwWrap}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  style={{ ...s.input, paddingRight: '42px', ...(error ? s.inputErr : {}) }}
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  autoComplete="current-password"
                  disabled={loading}
                  className="login-input"
                />
                <button
                  type="button"
                  style={s.eyeBtn}
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={s.errorBox} role="alert">
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <button
              id="btn-login-submit"
              type="submit"
              style={s.submitBtn}
              disabled={loading}
              className="login-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spinAnim 0.8s linear infinite' }} />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>

          <div style={s.divider}>
            <div style={s.dividerLine} />
            <span style={s.dividerText}>Info Akses Demo</span>
            <div style={s.dividerLine} />
          </div>

          <div style={s.demoBox}>
            <div style={s.demoRow}>
              <span style={s.demoKey}>Email</span>
              <code style={s.demoVal}>superadmin@sahabatsos.id</code>
            </div>
            <div style={s.demoRow}>
              <span style={s.demoKey}>Sandi</span>
              <code style={s.demoVal}>Admin@2026</code>
            </div>
          </div>
        </div>

        <p style={s.rightFooter}>
          Mengalami masalah akses?{' '}
          <button type="button" style={s.contactLink}>Hubungi Administrator</button>
        </p>
      </div>

      <style>{`
        @keyframes spinAnim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-7px); }
          40% { transform: translateX(7px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .login-shake { animation: shake 0.45s ease; }
        .login-input {
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .login-input:focus {
          outline: none;
          border-color: #059669 !important;
          box-shadow: 0 0 0 3px rgba(5,150,105,0.12) !important;
        }
        .login-input:disabled { opacity: 0.55; cursor: not-allowed; }
        .login-submit-btn {
          transition: background-color 0.15s, transform 0.1s;
        }
        .login-submit-btn:hover:not(:disabled) {
          background-color: #064e3b !important;
          transform: translateY(-1px);
        }
        .login-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .login-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

const s = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    backgroundColor: '#f1f5f9',
  },
  leftPanel: {
    width: '400px',
    flexShrink: 0,
    backgroundColor: '#062c26',
    display: 'flex',
    flexDirection: 'column',
    padding: '28px 32px',
    overflow: 'hidden',
  },
  leftTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '48px',
  },
  logoWrap: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoBox: {
    width: '36px', height: '36px', borderRadius: '10px',
    backgroundColor: '#ef4444', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
    boxShadow: '0 4px 12px rgba(239,68,68,0.35)',
  },
  brandName: { color: '#fff', fontWeight: '700', fontSize: '14px', lineHeight: '1.2', margin: 0 },
  brandSub: {
    color: '#34d399', fontSize: '10px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, marginTop: '2px',
  },
  liveBadge: {
    display: 'flex', alignItems: 'center', gap: '6px',
    backgroundColor: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)',
    borderRadius: '20px', padding: '4px 10px', fontSize: '11px', color: '#34d399', fontWeight: '500',
  },
  liveDot: {
    display: 'inline-block', width: '7px', height: '7px',
    borderRadius: '50%', backgroundColor: '#34d399',
    animation: 'livePulse 1.4s ease-in-out infinite',
  },
  leftBody: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  leftIcon: { marginBottom: '18px' },
  leftTitle: { color: '#fff', fontSize: '21px', fontWeight: '700', margin: '0 0 10px 0', letterSpacing: '-0.3px', lineHeight: '1.3' },
  leftDesc: { color: 'rgba(255,255,255,0.42)', fontSize: '13px', lineHeight: '1.7', margin: '0 0 28px 0' },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '20px' },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', padding: '14px 8px', display: 'flex',
    flexDirection: 'column', alignItems: 'center', gap: '4px',
  },
  statNum: { color: '#fff', fontSize: '22px', fontWeight: '700', lineHeight: '1' },
  statLabel: { color: 'rgba(255,255,255,0.38)', fontSize: '10px', textAlign: 'center', lineHeight: '1.3' },
  statusRow: {
    display: 'flex', alignItems: 'center', gap: '7px',
    backgroundColor: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.14)',
    borderRadius: '8px', padding: '9px 14px',
  },
  statusText: { color: '#6ee7b7', fontSize: '12px', fontWeight: '500' },
  leftFooter: { color: 'rgba(255,255,255,0.18)', fontSize: '11px', marginTop: '28px', lineHeight: '1.5' },

  rightPanel: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '40px 24px', backgroundColor: '#f1f5f9',
  },
  formCard: {
    width: '100%', maxWidth: '400px', backgroundColor: '#fff',
    borderRadius: '16px', padding: '36px 32px 28px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  },
  formHeader: { marginBottom: '26px' },
  formTitle: { fontSize: '19px', fontWeight: '700', color: '#111827', margin: '0 0 5px 0', letterSpacing: '-0.2px' },
  formSub: { fontSize: '13px', color: '#6b7280', margin: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  input: {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #d1d5db', borderRadius: '9px',
    fontSize: '14px', color: '#111827', fontFamily: 'inherit',
    backgroundColor: '#fff', boxSizing: 'border-box',
  },
  inputErr: { borderColor: '#f87171' },
  pwWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  eyeBtn: {
    position: 'absolute', right: '12px', background: 'none',
    border: 'none', cursor: 'pointer', color: '#9ca3af',
    display: 'flex', alignItems: 'center', padding: '2px',
  },
  forgotBtn: {
    background: 'none', border: 'none', fontSize: '12px',
    color: '#059669', cursor: 'pointer', fontFamily: 'inherit',
    padding: 0, fontWeight: '500',
  },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '8px',
    backgroundColor: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: '8px', padding: '10px 12px', color: '#dc2626', fontSize: '13px',
  },
  submitBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    width: '100%', padding: '11px 20px',
    backgroundColor: '#065f46', border: 'none', borderRadius: '9px',
    color: '#fff', fontSize: '14px', fontWeight: '600', fontFamily: 'inherit',
    cursor: 'pointer', marginTop: '4px', letterSpacing: '0.01em',
  },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0 14px' },
  dividerLine: { flex: 1, height: '1px', backgroundColor: '#e5e7eb' },
  dividerText: {
    fontSize: '10px', color: '#9ca3af', fontWeight: '600',
    whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  demoBox: {
    backgroundColor: '#f9fafb', border: '1px solid #e5e7eb',
    borderRadius: '8px', padding: '12px 14px',
    display: 'flex', flexDirection: 'column', gap: '6px',
  },
  demoRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  demoKey: { fontSize: '11px', color: '#9ca3af', fontWeight: '600', width: '36px', flexShrink: 0 },
  demoVal: {
    fontSize: '12px', color: '#374151', fontFamily: "'Courier New', monospace",
    backgroundColor: '#fff', border: '1px solid #e5e7eb',
    borderRadius: '5px', padding: '2px 7px',
  },
  rightFooter: { marginTop: '22px', fontSize: '12px', color: '#9ca3af', textAlign: 'center' },
  contactLink: {
    background: 'none', border: 'none', color: '#059669',
    fontFamily: 'inherit', fontSize: '12px', cursor: 'pointer', fontWeight: '500', padding: 0,
  },
};
