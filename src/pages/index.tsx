import { useState } from 'react';
import { SearchFilter } from '@/components/Filter/SearchFilter';
import { TabMenu } from '@/components/Tab/TabMenu';
import { ContentList } from '@/components/Content/ContentList';
import { EnvMap } from '@/components/Map/EnvMap';
import { PageTitle, SubPageTitle } from '@/components/PageTitle';
import { LoginModal } from '@/components/Modal/LoginModal';

const dummyData = [...Array(10)].map((_, i) => ({
  title: `콘텐츠 ${i + 1}`,
  description: '설명 텍스트입니다.',
  image: `https://picsum.photos/id/${i + 120}/200/200`,
}));
export type TabType = 'inventory' | 'cardnews' | 'map';

export default function MainPage() {
  const [open, setOpen] = useState(false);
  const tabList: { type: TabType; title: string; subTitle: string }[] = [
    {
      type: 'inventory',
      title: '인벤토리',
      subTitle: '환경 관련 콘텐츠를 확인하세요',
    },
    {
      type: 'cardnews',
      title: '카드뉴스',
      subTitle: '최신 환경 뉴스를 확인하세요',
    },
    {
      type: 'map',
      title: '환경지표',
      subTitle: '전국의 환경 지표를 확인하세요',
    },
  ];
  const [tab, setTab] = useState<{
    type: TabType;
    title: string;
    subTitle: string;
  }>({
    type: 'inventory',
    title: '인벤토리',
    subTitle: '환경 관련 콘텐츠를 확인하세요',
  });

  return (
    <main style={{ paddingInline: '24px' }}>
      <TabMenu
        setOpen={setOpen}
        active={tab?.type}
        onChange={(newTab) => setTab(tabList.find((t) => t.type === (newTab ?? 'inventory'))!)}
      />

      <div
        style={{
          maxWidth: '960px',
          margin: '52px auto',
        }}
      >
        <div style={{ borderLeft: '4px solid #18181B', paddingLeft: '16px' }}>
          <PageTitle>{tab?.title}</PageTitle>
          <SubPageTitle>{tab?.subTitle}</SubPageTitle>
        </div>

        <SearchFilter onSearch={() => console.log('검색')} />
        {tab?.type === 'inventory' && <ContentList items={dummyData} />}
        {tab?.type === 'cardnews' && <ContentList items={dummyData} />}
        {tab?.type === 'map' && <EnvMap />}
      </div>
      {open && <LoginModal onClose={() => setOpen(false)} />}
    </main>
  );
}
