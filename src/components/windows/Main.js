import React from 'react';
import '../../styles/main.css';
import TitleBar from '../TitleBar';
import Nav from './Main/Nav';
import Views from './Main/Views';

function Main() {
  return [
    <TitleBar key='titleBar' title='Argos' />,
    <Nav key='nav' />,
    <Views key='views' />,
  ];
}

export default Main;
