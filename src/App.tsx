import React from 'react';
import MainPage from '@/pages/index';

type Props = {
  onToggleTheme: () => void;
  themeMode: 'light' | 'dark';
};

function App({ onToggleTheme, themeMode }: Props) {
  return <MainPage />;
}

export default App;
