import close from '../icons/close.png';
import maximize from '../icons/maximize.png';
import maximized from '../icons/maximized.png';
import minimize from '../icons/minimize.png';
import styled from 'styled-components';
import { APP_VERSION } from '../types/ipcConstants';
import { BrowserWindow } from 'electron';
import { getColorWithOpacity } from '../styles/theme';
import { getIpcRenderer } from '../utils/electron';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

const isElectron = typeof window.require === 'function';
let w: BrowserWindow | null = null;

interface TitleBarProps {
  title: string;
  icon?: boolean;
  buttons?: boolean;
  colorClass?: string;
}

const TitleBar = (props: TitleBarProps) => {
  const [version, setVersion] = useState('0.0.0');
  const location = useLocation();
  if (props.colorClass) document.body.classList.add(props.colorClass);

  useEffect(() => {
    if (isElectron) {
      const ipcRenderer = getIpcRenderer();
      ipcRenderer.send(APP_VERSION);
      ipcRenderer.on(APP_VERSION, (event, text) => {
        setVersion(text?.version);
      });
    }
  }, []);

  if (isElectron) {
    w = window.require('electron').remote.getCurrentWindow();

    if (w) {
      w.on('show', (e) => {
        const maximizeElement = document.getElementById(
          'Maximize'
        ) as HTMLElement;
        if (maximizeElement)
          (maximizeElement.children[0] as HTMLImageElement).src = maximize;
        document.body.classList.add('border');
      });

      w.on('maximize', (e) => {
        const maximizeElement = document.getElementById(
          'Maximize'
        ) as HTMLElement;
        if (maximizeElement)
          (maximizeElement.children[0] as HTMLImageElement).src = maximized;
        document.body.classList.remove('border');
      });

      w.on('unmaximize', (e) => {
        const maximizeElement = document.getElementById(
          'Maximize'
        ) as HTMLElement;
        if (maximizeElement)
          (maximizeElement.children[0] as HTMLImageElement).src = maximize;
        document.body.classList.add('border');
      });
    }
  }

  const handleMinimize = (e) => {
    if (w !== null && w.isMinimizable()) w.minimize();
  };

  const handleMaximize = (e) => {
    if (w !== null && w.maximizable) {
      if (w.isMaximized()) w.unmaximize();
      else w.maximize();
    }
  };

  const handleClose = (e) => {
    if (w !== null && w.closable) w.close();
  };

  return (
    <TitleBarWrapper className={props.colorClass ? props.colorClass : ''}>
      {props.icon === false ? '' : <Icon>&nbsp;</Icon>}
      <AppName>
        {props.title}
        {location.pathname === '/main' && ' ' + version}
      </AppName>

      <Buttons className={props.buttons === false ? 'hidden' : ''}>
        <Button tabIndex={-1} onClick={handleMinimize}>
          <img src={minimize} alt='Minimize' />
        </Button>
        <Button id='Maximize' tabIndex={-1} onClick={handleMaximize}>
          <img src={maximized} alt='Maximize' />
        </Button>
        <Button tabIndex={-1} onClick={handleClose} isClose={true}>
          <img src={close} alt='Close' />
        </Button>
      </Buttons>
    </TitleBarWrapper>
  );
};

const TitleBarWrapper = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: center;

  height: 32px;

  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};

  -webkit-app-region: drag;
`;

const TitleBarItem = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 33%;
`;

const AppName = styled(TitleBarItem)`
  padding: 0 16px;

  font-size: 12px;
  font-weight: 400;
`;

const Icon = styled(TitleBarItem)`
  & + ${AppName} {
    text-align: center;
  }
`;

const Buttons = styled(TitleBarItem)`
  text-align: right;

  &.hidden {
    > * {
      display: none;
    }
  }
`;

const Button = styled.button`
  height: 32px;
  width: 46px;

  border: 0;
  background: transparent;
  color: ${(props) => props.theme.colors.white};

  transition: all 0.2s ease-out;

  -webkit-app-region: none;

  &:hover {
    background-color: ${(props) =>
      props.isClose
        ? props.theme.colors.danger
        : getColorWithOpacity(props.theme.colors.black, 20)};
    outline: none;
  }

  &:active,
  &:focus {
    outline: none;
  }
`;

export default TitleBar;
