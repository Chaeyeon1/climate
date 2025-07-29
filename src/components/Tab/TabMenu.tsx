import { TabType } from '@/pages';
import { useState } from 'react';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
  align-items: center;
  gap: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ active }) => (active ? '#689F38' : '#9CA3AF')};
  border-bottom: ${({ active }) =>
    active ? '2px solid #689F38' : '2px solid transparent'};
  cursor: pointer;
  border-radius: 0;
  &:hover {
    color: #689f38;
  }
`;

const TabWrapper = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

const Login = styled.button`
  color: #ffffff;
  background-color: #689f38;
  cursor: pointer;
  height: 32px;
  font-size: 12px;
  padding: 4px 16px;
`;
const Logout = styled.button`
  color: #689f38;
  border: 1px solid #689f38;
  background-color: transparent;
  cursor: pointer;
  height: 32px;
  font-size: 12px;
  padding: 4px 16px;
`;

export const TabMenu = ({
  active,
  onChange,
  setOpen,
}: {
  active: TabType;
  onChange: (tab: TabType) => void;
  setOpen: (open: boolean) => void;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Header>
      <TabWrapper>
        <Tab
          active={active === 'inventory'}
          onClick={() => onChange('inventory')}
        >
          인벤토리
        </Tab>
        <Tab
          active={active === 'cardnews'}
          onClick={() => onChange('cardnews')}
        >
          카드뉴스
        </Tab>
        <Tab active={active === 'map'} onClick={() => onChange('map')}>
          환경지표
        </Tab>
      </TabWrapper>
      {isLoggedIn ? (
        <>
          <span>신채연님</span>
          <Logout onClick={() => setIsLoggedIn(false)}>로그아웃</Logout>
        </>
      ) : (
        <Login onClick={() => setOpen(true)}>로그인</Login>
      )}
    </Header>
  );
};
