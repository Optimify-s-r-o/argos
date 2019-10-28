import React from 'react';
import './MessageBox.css';
import TitleBar from '../TitleBar';
import queryString from 'query-string';
import { withTranslation } from 'react-i18next';
import {closeCurrentElectronWindow, setCurrentElectronWindowTitle} from '../../utils/electron';

const MessageBoxPath = '/message-box';

const MessageBoxSettings = {
    maximizable: false,
    resizable: false,
    closable: false,
    frame: false,
    webPreferences: {
        nodeIntegration: true
    },
    backgroundColor: '#f0f0f0',
    show: false,
    useContentSize: true,
    width: 320,
    height: 133,
};

class MessageBox extends React.Component {
    render() {
        const { t } = this.props;
        const params = queryString.parse(this.props.location.search);

        let buttons = [];
        if (!Array.isArray(params.buttons))
            buttons = [params.buttons];
        else
            buttons = params.buttons;

        setCurrentElectronWindowTitle(t(params.key + '.title'));
        return [
            <TitleBar key="titleBar" title={t(params.key + '.title')} icon={false} buttons={false}/>,
            <div key="content" className="row text">
                <div className="column">
                    {t(params.key + '.text')}
                </div>
            </div>,
            <div key="buttons" className="row buttons">
                {buttons.map(button => {
                    return <button key={button} onClick={() => {closeCurrentElectronWindow()}} className={'btn btn-text btn-' + button}>{t('messageBox:buttons.' + button)}</button>;
                })}
            </div>
        ];
    }
}

MessageBox = withTranslation()(MessageBox);

export {MessageBox, MessageBoxPath, MessageBoxSettings};
