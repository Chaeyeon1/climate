import styled from 'styled-components';

export const Button = styled.button<{ $fullWidth?: boolean }>`
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  padding: 4px 16px;
  background-color: #18181b;
  color: #ffffff;
  cursor: pointer;
  height: 32px;
  font-size: 12px;
  border: none;
  border-radius: 4px;

  &:hover {
    background-color: #111111;
  }
`;
