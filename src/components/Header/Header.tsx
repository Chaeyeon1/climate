import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tab } from '@/components/Tab/Tab';
import { Button } from '../Button/Button';
import { Header as S } from './Header.styled';
import { PageType, TabType } from '@/types';

export const Header = ({ tabList, onLoginModalOpen }: { tabList: TabType[]; onLoginModalOpen: () => void }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const pathname = location.pathname as PageType;

  return (
    <S.Container>
      <img src="/logo.jpg" width="180px" height="32px" />
      <S.TabWrapper>
        {tabList.map((tab) => (
          <Link to={tab.type}>
            <Tab active={pathname.includes(tab.type)}>{tab.title}</Tab>
          </Link>
        ))}
      </S.TabWrapper>
      {isLoggedIn ? (
        <>
          <span>신채연님</span>
          <Button onClick={() => setIsLoggedIn(false)}>로그아웃</Button>
        </>
      ) : (
        <Button onClick={onLoginModalOpen}>로그인</Button>
      )}
    </S.Container>
  );
};
