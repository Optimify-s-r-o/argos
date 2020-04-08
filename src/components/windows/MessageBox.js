import React from 'react';
import TitleBar from '../TitleBar';
import queryString from 'query-string';
import { withTranslation } from 'react-i18next';
import {
  closeCurrentElectronWindow,
  getIpcRenderer,
  setCurrentElectronWindowTitle,
} from '../../utils/electron';
import styled from 'styled-components';
import { Row, Column, TextButton } from '../../styles/global';

const ipcRenderer = getIpcRenderer();

const MessageBoxPath = '/message-box';

const MessageBoxSettings = {
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

class MessageBox extends React.Component {
  onButtonClick(button, windowId) {
    ipcRenderer.send('msgboxButtonClick.' + windowId, button);
    closeCurrentElectronWindow();
  }

  render() {
    const { t } = this.props;
    const params = queryString.parse(this.props.location.search);

    let buttons = [];
    if (!Array.isArray(params.buttons)) buttons = [params.buttons];
    else buttons = params.buttons;

    setCurrentElectronWindowTitle(t(params.key + '.title'));
    return [
      <TitleBar
        key='titleBar'
        title={t(params.key + '.title')}
        icon={false}
        buttons={false}
        colorClass={params.type}
      />,
      <Content key='content'>
        <Column>{t(params.key + '.text')}</Column>
      </Content>,
      <Buttons key='buttons' type={params.type}>
        {buttons.map((button) => {
          return (
            <MsgBoxButton
              key={button}
              type={params.type}
              button={button}
              onClick={() => {
                this.onButtonClick(button, params.windowId);
              }}
            >
              {t('messageBox:buttons.' + button)}
            </MsgBoxButton>
          );
        })}
      </Buttons>,
    ];
  }
}

MessageBox = withTranslation()(MessageBox);

export { MessageBox, MessageBoxPath, MessageBoxSettings };

const colors = {
  info: {
    yes: '#046',
    ok: '#046',
    no: 'rgba(0, 0, 0, 0.3)',
    cancel: 'rgba(0, 0, 0, 0.3)',
  },
  warning: {
    yes: '#ffbc45',
    ok: '#ffbc45',
    no: 'rgba(0, 0, 0, 0.3)',
    cancel: 'rgba(0, 0, 0, 0.3)',
  },
  error: {
    yes: '#ff4040',
    ok: '#ff4040',
    no: 'rgba(0, 0, 0, 0.3)',
    cancel: 'rgba(0, 0, 0, 0.3)',
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

  border-color: ${(props) => colors[props.type][props.button]};
  color: ${(props) => colors[props.type][props.button]};

  &:hover {
    background-color: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? colors[props.type][props.button]
        : 'rgba(0, 0, 0, 0.30)'};
    border-color: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? colors[props.type][props.button]
        : 'transparent'};
    color: ${(props) =>
      props.button === 'yes' || props.button === 'ok' ? '#fff' : '#046'};
  }

  &:active {
    background-color: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? 'inherit'
        : 'rgba(0, 0, 0, 0.30)'};
    border-color: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? colors[props.type][props.button]
        : 'transparent'};
    color: ${(props) =>
      props.button === 'yes' || props.button === 'ok' ? 'inherit' : '#046'};
  }

  &:focus {
    outline: ${(props) =>
      props.button === 'yes' || props.button === 'ok' ? 'inherit' : 0};

    box-shadow: ${(props) =>
      props.button === 'yes' || props.button === 'ok'
        ? 'inherit'
        : '0 0 10px 0 rgba(0, 0, 0, 0.1)'};
  }
`;
