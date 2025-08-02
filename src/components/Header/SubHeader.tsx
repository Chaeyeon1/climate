import { TabType } from './Header.types';

export const SubHeader = () => {
  const tabList: { type: TabType; title: string; subTitle: string }[] = [
    {
      type: 'inventory',
      title: '인벤토리',
      subTitle: '환경 관련 콘텐츠를 확인하세요',
    },
    {
      type: 'news',
      title: '카드뉴스',
      subTitle: '최신 환경 뉴스를 확인하세요',
    },
    {
      type: 'map',
      title: '환경지표',
      subTitle: '전국의 환경 지표를 확인하세요',
    },
  ];

  return (
    <div style={{ borderLeft: '4px solid #18181B', paddingLeft: '16px' }}>
      <PageTitle>{tab?.title}</PageTitle>
      <SubPageTitle>{tab?.subTitle}</SubPageTitle>
    </div>
  );
};
