import { styled } from 'styled-components';

const Container = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
  align-items: center;
  gap: 40px;
`;

const TabWrapper = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

export const Header = {
  Container,
  TabWrapper,
};
