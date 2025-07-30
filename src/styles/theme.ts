import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
  mode: 'light',
  colors: {
    background: '#ffffff',
    text: '#111111',
    primary: '#0070f3',
  },
};

export const darkTheme: DefaultTheme = {
  mode: 'dark',
  colors: {
    background: '#111111',
    text: '#ffffff',
    primary: '#00c3ff',
  },
};
