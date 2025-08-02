import { styled } from 'styled-components';

const Container = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
  align-items: center;
  gap: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 0px;
  }
`;

const Logo = styled.img`
  width: 180px;
  height: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const LoginInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const MyName = styled.span`
  font-weight: 600;
  font-size: 15px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const TabWrapper = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

export const Header = {
  Container,
  Logo,
  TabWrapper,
  LoginInfo,
  MyName,
};
