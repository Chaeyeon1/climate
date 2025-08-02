import { useEffect, useState } from 'react';
import { axiosInstance } from '@/libs/axios';
import { FilterResponse } from '@/types';
import { usePath } from './usePath';

export const useFilter = () => {
  const { dynamicPath } = usePath();
  const [data, setData] = useState<FilterResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get<FilterResponse>(`${dynamicPath}/filters`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [dynamicPath]);

  return { data, isLoading: loading };
};
