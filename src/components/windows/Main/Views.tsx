import isConnected from '../../../api/proxy/connected';
import OpenWindow from '../../OpenWindow';
import React, { useState } from 'react';
import styled from 'styled-components';
import views from '../../../enums/views';
import WarningBar from './Views/WarningBar';
import { connect } from 'react-redux';
import { SettingsPath, SettingsSettings } from '../Settings';
import { useTranslation } from 'react-i18next';

const mapStateToProps = (state) => {
  return {
    pambaPath: state.settings.pambaPath,
    url: state.settings.url,
    view: state.settings.view,
    token: state.token,
  };
};

interface ViewsProps {
  pambaPath: string;
  url: string;
  view: string;
  token: string;
}

const Views = (props: ViewsProps) => {
  const [
    pambaConnectionWarningVisible,
    setPambaConnectionWarningVisible,
  ] = useState(true);
  const { t } = useTranslation();

  // TODO change to event listener (emitter is settings window)
  isConnected((data) => {
    const showWarning = !data.body;

    if (pambaConnectionWarningVisible !== showWarning)
      setPambaConnectionWarningVisible(showWarning);
  });

  return (
    <ViewsWrapper>
      <WarningBar
        visible={false}
        text={t('warnings:pambaConnection.text')}
        action={
          <OpenWindow
            path={
              SettingsPath +
              '?url=' +
              props.url +
              '&pambaPath=' +
              props.pambaPath +
              '&token=' +
              props.token
            }
            windowSettings={SettingsSettings}
          >
            <a>{t('warnings:pambaConnection.action')}</a>.
          </OpenWindow>
        }
      />
      <View>{views.hasOwnProperty(props.view) && views[props.view]}</View>
    </ViewsWrapper>
  );
};

const ViewsWrapper = styled.div`
  position: absolute;

  top: 152px;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;

  flex-direction: column;
`;

const View = styled.div`
  position: relative;

  flex-grow: 1;
`;

export default connect(mapStateToProps)(Views);
