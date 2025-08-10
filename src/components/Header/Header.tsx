import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tab } from '@/components/Tab/Tab';
import { Button } from '../Button/Button';
import { Header as S } from './Header.styled';
import { PageType, TabType } from '@/types';

export const Header = ({
  tabList,
  onLoginModalOpen,
  handleLogout,
  isLoggedIn,
}: {
  tabList: TabType[];
  onLoginModalOpen: () => void;
  handleLogout: () => void;
  isLoggedIn: boolean;
}) => {
  const location = useLocation();
  const pathname = location.pathname as PageType;

  return (
    <S.Container>
      <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
        <S.Logo src="/logo.jpg" />
      </Link>
      <S.TabWrapper>
        {tabList.map((tab) => (
          <Link key={tab.type} to={tab.type}>
            <Tab $active={pathname.includes(tab.type)}>{tab.title}</Tab>
          </Link>
        ))}
      </S.TabWrapper>
      {isLoggedIn ? (
        <S.LoginInfo>
          <S.MyName>신채연님</S.MyName>
          <Button onClick={handleLogout}>로그아웃</Button>
        </S.LoginInfo>
      ) : (
        <Button onClick={onLoginModalOpen}>로그인</Button>
      )}
    </S.Container>
  );
};
