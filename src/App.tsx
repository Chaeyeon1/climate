import { Navigate, Route, Routes } from 'react-router-dom';
import { SearchFilter } from './components/Filter/SearchFilter';
import { PageTitle, SubPageTitle } from './components/PageTitle';
import { ContentList } from './components/Content/ContentList';
import { EnvMap } from './components/Map/EnvMap';
import { LoginModal } from './components/Modal/LoginModal';
import { useState } from 'react';
import { Header } from './components/Header/Header';
import { SubHeader } from './components/Header/SubHeader';
import { TabType } from './types';
import { InventoryDetail } from './pages/inventory/InventoryDetail/InventoryDetail';

type Props = {
  onToggleTheme: () => void;
  themeMode: 'light' | 'dark';
};

const dummyData = [...Array(10)].map((_, i) => ({
  title: `콘텐츠 ${i + 1}`,
  description: '설명 텍스트입니다.',
  image: `https://picsum.photos/id/${i + 120}/200/200`,
}));

function App({}: Props) {
  const [open, setOpen] = useState(false);
  const handleLoginModalOpen = () => {
    setOpen(true);
  };

  const tabList: TabType[] = [
    {
      type: '/inventory',
      title: '인벤토리',
      subTitle: '환경 관련 콘텐츠를 확인하세요',
    },
    {
      type: '/news',
      title: '카드뉴스',
      subTitle: '최신 환경 뉴스를 확인하세요',
    },
    {
      type: '/map',
      title: '환경지표',
      subTitle: '전국의 환경 지표를 확인하세요',
    },
  ];

  return (
    <main style={{ paddingInline: '24px' }}>
      <Header tabList={tabList} onLoginModalOpen={handleLoginModalOpen} />
      <div
        style={{
          maxWidth: '960px',
          margin: '52px auto',
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/inventory" replace />} />
          <Route path="/inventory" element={<ContentList items={dummyData} />} />
          <Route path="/inventory/:id" element={<InventoryDetail />} />
          <Route path="/news" element={<ContentList items={dummyData} />} />
          <Route path="/map" element={<EnvMap />} />
        </Routes>
      </div>
      {open && <LoginModal onClose={() => setOpen(false)} />}
    </main>
  );
}

export default App;
