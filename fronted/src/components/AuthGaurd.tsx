import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

interface AuthGuardProps {
  allowrole?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ allowrole }) => {
  const [auth, setAuth] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get('/me');
        setAuth(!allowrole || data.role === allowrole);
      } catch {
        setAuth(false); // token missing/invalid or server error
      }
    })();
  }, [allowrole]);

  // while auth === null you could return a spinner or skeleton
  if (auth === null) return null;

  return auth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthGuard;
