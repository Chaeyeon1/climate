import { createGlobalStyle } from 'styled-components';

// palette 정의해줘
export const palette = {
  primary: '#18181B',
  secondary: '#F9FAFB',
  textPrimary: '#000000',
  textSecondary: '#FFFFFF',
  border: '#E5E7EB',
};

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background-color: #ffffff;
    color: #18181B;
    font-family: 'Pretendard', sans-serif;
    font-size: 16px;
    line-height: 1.6;
  }

  button, input, select {
    font-family: inherit;
    font-size: 14px;
    border: none;
    border-radius: 8px;
    padding: 10px 16px;
    transition: 0.2s all ease;
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    };
    &:active {
      opacity: 1;
    };
  }

  button {
    background-color: #18181B;
    color: white;
  }

  select, input {
    background-color: #F9FAFB;
    border: 1px solid #E5E7EB;
    color: #18181B;
  }

  select:focus, input:focus {
    border-color: #18181B;
    outline: none;
  }
`;
