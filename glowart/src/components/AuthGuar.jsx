// src/components/AuthGuard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
export default function AuthGuard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get('http://localhost:8000/login/me');
        if (!res.data.user) {
          navigate('/');
        }
      } catch {
        navigate('/');
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, [navigate]);

  if (checking) {
    return <div>驗證中…</div>;
  }

  // 如果通過驗證，就 render 子路由（<Outlet />）
  return <Outlet />;
}
