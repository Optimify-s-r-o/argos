import queryString from 'query-string';
import React from 'react';
import styled from 'styled-components';
import TitleBar from '../TitleBar';
import { BrowserWindowConstructorOptions } from 'electron';
import { Column, Row, TextButton } from '../../styles/global';
import { defaultTheme, getColorWithOpacity } from '../../styles/theme';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  closeCurrentElectronWindow,
  getIpcRenderer,
  setCurrentElectronWindowTitle,
} from '../../utils/electron';

interface MessageBoxProps {}

const ipcRenderer = getIpcRenderer();

const MessageBoxPath = '/message-box';

const MessageBoxSettings: BrowserWindowConstructorOptions = {
  maximizable: false,
  resizable: false,
  closable: false,
  frame: false,
  webPreferences: {
    nodeIntegration: true,
  },
  backgroundColor: '#f0f0f0',
  show: false,
  useContentSize: true,
  width: 320,
  height: 133,
};

const MessageBox = (props: MessageBoxProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = queryString.parse(location.search);

  const onButtonClick = (button: string, windowId: string) => {
    ipcRenderer.send('msgboxButtonClick.' + windowId, button);
    closeCurrentElectronWindow();
  };

  let buttons: string[] = [];
  if (!Array.isArray(params.buttons)) {
    if (params.buttons) buttons = [params.buttons];
  } else buttons = params.buttons;

  setCurrentElectronWindowTitle(t(params.key + '.title'));

  return (
    <>
      <TitleBar
        title={t(params.key + '.title')}
        icon={false}
        buttons={false}
        colorClass={params.type as string}
      />
      <Content>
        <Column>{t(params.key + '.text')}</Column>
      </Content>
      <Buttons>
        {buttons.map((button) => {
          return (
            <MsgBoxButton
              key={button}
              buttonType={params.type}
              button={button}
              onClick={() => {
                onButtonClick(button, params.windowId as string);
              }}
            >
              {t('messageBox:buttons.' + button)}
            </MsgBoxButton>
          );
        })}
      </Buttons>
    </>
  );
};

export { MessageBox, MessageBoxPath, MessageBoxSettings };

const colors = {
  info: {
    yes: defaultTheme.colors.primary,
    ok: defaultTheme.colors.primary,
    no: getColorWithOpacity(defaultTheme.colors.black, 25),
    cancel: getColorWithOpacity(defaultTheme.colors.black, 25),
  },
  warning: {
    yes: defaultTheme.colors.warning,
    ok: defaultTheme.colors.warning,
    no: getColorWithOpacity(defaultTheme.colors.black, 25),
    cancel: getColorWithOpacity(defaultTheme.colors.black, 25),
  },
  error: {
    yes: defaultTheme.colors.danger,
    ok: defaultTheme.colors.danger,
    no: getColorWithOpacity(defaultTheme.colors.black, 25),
    cancel: getColorWithOpacity(defaultTheme.colors.black, 25),
  },
};

const Content = styled(Row)`
  padding: 16px;

  font-weight: 400;
`;

const Buttons = styled(Row)`
  padding: 8px 16px;

  justify-content: flex-end;

  background-color: white;
`;

const MsgBoxButton = styled(TextButton)`
  display: inline-block;

  margin-left: 16px;

  border-color: ${(props) => colors[props.buttonType][props.button]};
  color: ${(props) => colors[props.buttonType][props.button]};

  &:hover {
    background-color: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? colors[props.buttonType][props.button]
        : getColorWithOpacity(defaultTheme.colors.black, 25)};
    border-color: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? colors[props.buttonType][props.button]
        : 'transparent'};
    color: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? props.theme.colors.white
        : props.theme.colors.primary};
  }

  &:active {
    background-color: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? 'inherit'
        : getColorWithOpacity(defaultTheme.colors.black, 25)};
    border-color: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? colors[props.buttonType][props.button]
        : 'transparent'};
    color: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? 'inherit'
        : props.theme.colors.primary};
  }

  &:focus {
    outline: ${(props) =>
      props.button === 'yes' || props.button === 'ok' ? 'inherit' : 0};

    box-shadow: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? 'inherit'
        : '0 0 10px 0 ' + getColorWithOpacity(props.theme.colors.black, 10)};
  }
`;
