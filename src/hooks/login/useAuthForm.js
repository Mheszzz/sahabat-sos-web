import { useState } from 'react';
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

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

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
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Email atau kata sandi tidak valid.';
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
    handleSubmit
  };
}

