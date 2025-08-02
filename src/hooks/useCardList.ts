import { useEffect, useState } from 'react';
import { axiosInstance } from '@/libs/axios';
import { CardParams, CardResponse } from '@/types';
import { usePath } from './usePath';

export const useCardList = (params?: CardParams) => {
  const { dynamicPath } = usePath();
  const [data, setData] = useState<CardResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get<CardResponse[]>(dynamicPath, { params });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [dynamicPath, JSON.stringify(params)]);

  return { data, isLoading: loading };
};
