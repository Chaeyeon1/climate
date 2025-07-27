import styled from 'styled-components';

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #18181b;
  margin: 32px 0 4px;
`;

export const PageTitle = ({ children }: { children: string }) => {
  return <Title>{children}</Title>;
};

export const SubPageTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #768392;
  margin-top: 0px;
`;
