import Nav from './Main/Nav';
import React from 'react';
import TitleBar from '../TitleBar';
import Views from './Main/Views';
import { BrowserWindowConstructorOptions } from 'electron';
import { defaultTheme } from '../../styles/theme';
import '../../styles/main.css';

export const MainPath = '/main';

export const MainSettings: BrowserWindowConstructorOptions = {
  minWidth: 1024,
  show: false,
  frame: false,
  webPreferences: {
    nodeIntegration: true,
  },
  backgroundColor: defaultTheme.colors.white,
  title: 'Argos planner',
};

export const Main = () => {
  return (
    <>
      <TitleBar title='Argos planner' />
      <Nav />
      <Views />
    </>
  );
};

export default Main;
