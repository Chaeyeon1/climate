import { DefaultTheme } from 'styled-components';

const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1440px',
};

export const lightTheme: DefaultTheme = {
  mode: 'light',
  palette: {
    background: '#ffffff',
    text: '#18181B',
    primary: '#18181B',
    contrastText: '#F9FAFB',
  },
  breakpoints,
};

export const darkTheme: DefaultTheme = {
  mode: 'dark',
  palette: {
    background: '#111111',
    text: '#ffffff',
    primary: '#00c3ff',
    contrastText: '#F9FAFB',
  },
  breakpoints,
};
