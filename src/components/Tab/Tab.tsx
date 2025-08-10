import { styled } from 'styled-components';

export const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 12px 12px;
  font-size: 17px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#18181B' : '#9CA3AF')};
  border-bottom: ${({ $active }) => ($active ? '2px solid #18181B' : '2px solid transparent')};
  cursor: pointer;
  border-radius: 0;
  &:hover {
    color: #18181b;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 8px 16px;
    font-size: 16px;
  }
`;
