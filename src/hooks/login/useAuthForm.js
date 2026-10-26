import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/services/authService';

export function useAuthForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '' });

  // Guest guard: jika admin sudah memiliki token aktif, langsung arahkan ke dashboard
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const fillDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const openInfoModal = (type) => {
    if (type === 'forgot') {
      setModalInfo({
        isOpen: true,
        title: 'Pemulihan Kata Sandi Administrator',
        message: 'Demi alasan keamanan operasional dan privasi data tanggap darurat, reset kata sandi akun Admin dilakukan secara terpusat oleh Superadmin atau Tim IT Posko Sahabat SOS. Silakan hubungi Superadmin atau Posko Utama untuk menerbitkan kata sandi baru.',
      });
    } else if (type === 'contact') {
      setModalInfo({
        isOpen: true,
        title: 'Pusat Bantuan & Kontak Administrator',
        message: 'Hubungi Posko Pusat Sahabat SOS:\n• Email: superadmin@sahabatsos.com\n• Telepon/WhatsApp Posko: 0812-3456-7890\n• Jam Operasional Posko Tanggap Darurat: 24 Jam Non-Stop.',
      });
    }
  };

  const closeModal = () => {
    setModalInfo({ isOpen: false, title: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Email dan kata sandi wajib diisi.');
      triggerShake();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Format alamat email tidak valid.');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      await authService.login({ email: cleanEmail, password });
      navigate('/dashboard');
    } catch (err) {
      let msg = 'Email atau kata sandi tidak valid.';

      if (!err?.response) {
        msg = 'Tidak dapat terhubung ke server. Pastikan koneksi internet aktif dan server backend berjalan.';
      } else if (err.response.data?.errors) {
        const errorKeys = Object.keys(err.response.data.errors);
        if (errorKeys.length > 0 && err.response.data.errors[errorKeys[0]]?.[0]) {
          msg = err.response.data.errors[errorKeys[0]][0];
        }
      } else if (err.response.data?.message) {
        msg = err.response.data.message;
      }

      setError(msg);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    loading,
    error, setError,
    shake,
    modalInfo,
    openInfoModal,
    closeModal,
    fillDemoCredentials,
    handleSubmit
  };
}
