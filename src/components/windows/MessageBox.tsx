import queryString from 'query-string';
import React, { useState } from 'react';
import styled from 'styled-components';
import { BrowserWindowConstructorOptions } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, TextButton } from '../../styles/global';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  defaultTheme,
  getColorWithOpacity,
  getMultipliedColor,
} from '../../styles/theme';
import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  closeCurrentElectronWindow,
  getCurrentElectronWindow,
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
  width: 480,
  height: 240,
  parent: getCurrentElectronWindow(),
  modal: true,
};

const MessageBox = (props: MessageBoxProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = queryString.parse(location.search);

  const [type] = useState(params.type);

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
    <Wrapper type={type}>
      <TextWrapper>
        <Title>{t(params.key + '.title')}</Title>
        <Content>{t(params.key + '.text')}</Content>
      </TextWrapper>
      <Symbol type={type}>
        <FontAwesomeIcon
          icon={
            type === 'success'
              ? faCheckCircle
              : type === 'warning'
              ? faExclamationTriangle
              : type === 'error' || type === 'danger'
              ? faExclamationCircle
              : type === 'question'
              ? faQuestionCircle
              : faInfoCircle
          }
        />
      </Symbol>
      <Buttons>
        {buttons.map((button) => {
          return (
            <MsgBoxButton
              key={button}
              button={button}
              type={type}
              onClick={() => {
                onButtonClick(button, params.windowId as string);
              }}
              autoFocus={button === 'yes' || button === 'ok'}
            >
              {t('messageBox:buttons.' + button)}
            </MsgBoxButton>
          );
        })}
      </Buttons>
    </Wrapper>
  );
};

export { MessageBox, MessageBoxPath, MessageBoxSettings };

const Wrapper = styled.div<{ type: string }>`
  display: flex;
  flex-direction: column;
  position: relative;

  height: 100%;

  padding: 16px 32px;

  background-color: ${(props) =>
    getMultipliedColor(props.theme.colors[props.type], 0.9)};
  color: ${(props) => props.theme.colors.white};
  font-weight: 400;

  overflow: hidden;
`;

const Symbol = styled.div<{ type: string }>`
  position: absolute;

  top: -48px;
  right: -48px;

  line-height: 256px;

  color: ${(props) => props.theme.colors[props.type]};
  font-size: 256px;

  pointer-events: none;
  transform: rotate(20deg);
`;

const TextWrapper = styled.div`
  position: relative;
  z-index: 1;

  flex-grow: 1;

  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  margin-bottom: 24px;

  font-size: 32px;
  font-weight: 300;
`;

const Content = styled.div`
  flex-grow: 1;

  font-size: 16px;
`;

const Buttons = styled(Row)`
  padding: 8px 16px;

  justify-content: center;
`;

const MsgBoxButton = styled(TextButton)<{ type: string }>`
  display: inline-block;

  margin: 0 0.5rem;

  background-color: ${(props) =>
    props.button === 'yes' || props.button === 'ok'
      ? props.theme.colors.white
      : 'transparent'};
  border: none;
  color: ${(props) =>
    props.button === 'yes' || props.button === 'ok'
      ? getMultipliedColor(props.theme.colors[props.type], 0.8)
      : props.theme.colors.white};

  &:hover {
    background-color: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? props.theme.colors.white
        : getColorWithOpacity(props.theme.colors.black, 10)};
    box-shadow: 0 0 10px 0
      ${(props) =>
        props.button === 'yes' || props.button === 'ok'
          ? getColorWithOpacity(props.theme.colors.black, 20)
          : getColorWithOpacity(props.theme.colors.black, 10)};
    color: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? getMultipliedColor(props.theme.colors[props.type], 0.8)
        : props.theme.colors.white};
  }

  &:active {
    background-color: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? '#eeeeee'
        : getColorWithOpacity(props.theme.colors.black, 20)};
    color: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? getMultipliedColor(props.theme.colors[props.type], 0.8)
        : props.theme.colors.white};
  }

  &:focus {
    outline: ${(props) =>
      props.button === 'yes' || props.button === 'ok' ? 'inherit' : 0};

    background-color: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? props.theme.colors.white
        : getColorWithOpacity(defaultTheme.colors.black, 20)};

    box-shadow: 0 0 20px 2px
      ${(props) => getColorWithOpacity(props.theme.colors.black, 20)};
  }
`;
