import {  useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Siren, AlertCircle, Loader2, ShieldCheck, Activity } from 'lucide-react';
import { useAuthForm } from '../../hooks/login/useAuthForm';
import { s } from './LoginStyles';

// Shape yang nantinya bisa diisi dari API response
// { nama, email, role, avatar }
export default function LoginPage() {
  const { email, setEmail, password, setPassword, showPassword, setShowPassword, loading, error, setError, shake, handleSubmit } = useAuthForm();

  return (
    <div style={s.root}>
      {/* Left panel */}
      <div style={s.leftPanel}>
        <div style={s.leftTop}>
          <div style={s.logoWrap}>
            <div style={s.logoBox}>
              <img src="/logo.png" alt="Sahabat SOS Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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

        <p style={s.leftFooter}>Â© 2026 Sahabat SOS â€” Inklusi &amp; Tanggap Darurat Difabel</p>
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
                placeholder="contoh @sahabatsos.com"
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
            <span style={s.dividerText}></span>
            <div style={s.dividerLine} />
          </div>

          <div style={s.demoBox}>
            <div style={s.demoRow}>
              <span style={s.demoKey}>Email</span>
              <code style={s.demoVal}>superadmin@sahabatsos.com</code>
            </div>
            <div style={s.demoRow}>
              <span style={s.demoKey}>Sandi</span>
              <code style={s.demoVal}>password123</code>
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

;


