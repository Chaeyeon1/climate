import { Navigate, Route, Routes } from 'react-router-dom';
import { SearchFilter } from './components/Filter/SearchFilter';
import { PageTitle, SubPageTitle } from './components/PageTitle';
import { CardList } from './components/Card/CardList';
import { EnvMap } from './components/Map/EnvMap';
import { LoginModal } from './components/Modal/LoginModal';
import { useEffect, useState } from 'react';
import { Header } from './components/Header/Header';
import { SubHeader } from './components/Header/SubHeader';
import { TabType } from './types';
import { MarkdownContent } from './components/MarkdownContent/MarkdownContent';
import { useLogin } from './hooks/useLogin';
import toast, { Toaster } from 'react-hot-toast';

type Props = {
  onToggleTheme: () => void;
  themeMode: 'light' | 'dark';
};

function App({}: Props) {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, handleLogin, handleLogout, isLoading } = useLogin();

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
      <Toaster />
      <Header
        tabList={tabList}
        onLoginModalOpen={handleLoginModalOpen}
        handleLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />
      <div
        style={{
          maxWidth: '960px',
          margin: '52px auto',
        }}
      >
        <SubHeader tabList={tabList} />
        <Routes>
          <Route path="/" element={<Navigate to="/inventory" replace />} />
          <Route path="/inventory" element={<CardList />} />
          <Route path="/inventory/:id" element={<MarkdownContent />} />
          <Route path="/news" element={<CardList />} />
          <Route path="/news/:id" element={<MarkdownContent />} />
          <Route path="/map" element={<EnvMap />} />
        </Routes>
      </div>
      {open && <LoginModal isLoading={isLoading} onClose={() => setOpen(false)} onLogin={handleLogin} />}
    </main>
  );
}

export default App;
