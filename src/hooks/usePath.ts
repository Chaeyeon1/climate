import { INVENTORY_PATH, MAP_PATH, NEWS_PATH } from '@/const';
import { useLocation } from 'react-router-dom';

export const usePath = () => {
  const location = useLocation();
  const isInventory = location.pathname.includes(INVENTORY_PATH);
  const isNews = location.pathname.includes(NEWS_PATH);
  const isMap = location.pathname.includes(MAP_PATH);
  const dynamicPath = isInventory ? INVENTORY_PATH : isNews ? NEWS_PATH : isMap ? MAP_PATH : '';

  return { isInventory, isNews, isMap, dynamicPath };
};
