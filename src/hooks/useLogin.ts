import { axiosInstance } from '@/libs/axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(window.location.hostname + '.accessToken');
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogin = async ({
    email,
    password,
    onClose,
  }: {
    email: string;
    password: string;
    onClose: () => void;
  }) => {
    try {
      const res = await axiosInstance.post('/login', { email, password });
      const { accessToken } = res.data;
      setLoading(true);

      localStorage.setItem(window.location.hostname + '.accessToken', accessToken);
      setIsLoggedIn(true);
      onClose();
      toast.success('로그인 성공!');
    } catch (err) {
      toast.error('로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(window.location.hostname + '.accessToken');
    setIsLoggedIn(false);
    toast.success('로그아웃 성공!');
  };

  return {
    isLoggedIn,
    handleLogin,
    handleLogout,
    isLoading: loading,
  };
};
