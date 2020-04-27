import Main, { MainPath } from './windows/Main';
import React from 'react';
import { CapacityChange, CapacityChangePath } from './windows/CapacityChange';
import { CreatePhase, CreatePhasePath } from './windows/CreatePhase';
import { defaultTheme } from '../styles/theme';
import { HashRouter, Route } from 'react-router-dom';
import { JobAdd, JobAddPath } from './windows/JobAdd';
import { JobInfo } from './windows/JobInfo';
import { Login } from './windows/Login';
import { MessageBox, MessageBoxPath } from './windows/MessageBox';
import { MoveCapacity, MoveCapacityPath } from './windows/MoveCapacity';
import { Settings, SettingsPath } from './windows/Settings';
import { ThemeProvider } from 'styled-components';
import {
  DayCapacityEdit,
  DayCapacityEditPath,
} from './windows/DayCapacityEdit';
import {
  GenerateDocument,
  GenerateDocumentPath,
} from './windows/GenerateDocument';

const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <HashRouter>
        <Route exact path='/' component={Login} />
        <Route path={MainPath} component={Main} />
        <Route path='/job-info' component={JobInfo} />
        <Route path={JobAddPath} component={JobAdd} />
        <Route path={CapacityChangePath} component={CapacityChange} />
        <Route path={DayCapacityEditPath} component={DayCapacityEdit} />
        <Route path={CreatePhasePath} component={CreatePhase} />
        <Route path={GenerateDocumentPath} component={GenerateDocument} />
        <Route path={MessageBoxPath} component={MessageBox} />
        <Route path={SettingsPath} component={Settings} />
        <Route path={MoveCapacityPath} component={MoveCapacity} />
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
