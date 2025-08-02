import { Route, Routes } from 'react-router-dom';
import { SearchFilter } from './components/Filter/SearchFilter';
import { PageTitle, SubPageTitle } from './components/PageTitle';
import { ContentList } from './components/Content/ContentList';
import { EnvMap } from './components/Map/EnvMap';
import { LoginModal } from './components/Modal/LoginModal';
import { TabMenu } from './components/Tab/TabMenu';
import { useState } from 'react';
import { Header } from './components/Header/Header';
import { SubHeader } from './components/Header/SubHeader';

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

  return (
    <main style={{ paddingInline: '24px' }}>
      <Header onLoginModalOpen={handleLoginModalOpen} />
      <div
        style={{
          maxWidth: '960px',
          margin: '52px auto',
        }}
      >
        <SubHeader />

        <SearchFilter onSearch={() => console.log('검색')} />
        {/* {tab?.type === 'inventory' && <ContentList items={dummyData} />}
          {tab?.type === 'cardnews' && <ContentList items={dummyData} />}
          {tab?.type === 'map' && <EnvMap />} */}
        <Routes>
          <Route path='/' element={<ContentList items={dummyData} />} />
          <Route path='/news' element={<ContentList items={dummyData} />} />
          <Route path='/environment' element={<EnvMap />} />
        </Routes>
      </div>
      {open && <LoginModal onClose={() => setOpen(false)} />}
    </main>
  );
}

export default App;
