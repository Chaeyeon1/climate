import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tab } from '@/components/Tab/Tab';
import { Button } from '../Button/Button';
import { Header as S } from './Header.styled';

export const Header = ({
  onLoginModalOpen,
}: {
  onLoginModalOpen: () => void;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  return (
    <S.Container>
      <img src='/logo.jpg' width='180px' height='32px' />
      <S.TabWrapper>
        <Tab active={location.pathname === '/'}>
          <Link to='/'>인벤토리</Link>
        </Tab>
        <Tab active={location.pathname === '/news'}>
          <Link to='/news'>카드뉴스</Link>
        </Tab>
        <Tab active={location.pathname === '/environment'}>
          <Link to='/environment'>환경지표</Link>
        </Tab>
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
