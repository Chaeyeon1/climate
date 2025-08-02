import { useEffect, useState } from 'react';
import { axiosInstance } from '@/libs/axios';
import { MarkdownContentResponse } from '@/types';
import { usePath } from './usePath';
import { useParams } from 'react-router-dom';

export const useMarkdownContent = () => {
  const { id } = useParams();
  const { isInventory, isNews, dynamicPath } = usePath();
  const [data, setData] = useState<MarkdownContentResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get<MarkdownContentResponse>(`${dynamicPath}/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [isInventory, isNews]);

  return { data, isLoading: loading };
};
