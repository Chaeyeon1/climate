import { PageTitle, SubPageTitle } from '../PageTitle';
import { useLocation } from 'react-router-dom';
import { TabType } from '@/types';

export const SubHeader = ({ tabList }: { tabList: TabType[] }) => {
  const location = useLocation();
  const tab = tabList.find((t) => t.type === location.pathname);
  return (
    <div style={{ borderLeft: '4px solid #18181B', paddingLeft: '16px' }}>
      <PageTitle>{tab?.title}</PageTitle>
      <SubPageTitle>{tab?.subTitle}</SubPageTitle>
    </div>
  );
};
