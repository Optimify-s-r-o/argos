import React from 'react';
import './MessageBox.css';
import TitleBar from '../TitleBar';
import queryString from 'query-string';
import { withTranslation } from 'react-i18next';
import {closeCurrentElectronWindow, getIpcRenderer, setCurrentElectronWindowTitle} from '../../utils/electron';
const ipcRenderer = getIpcRenderer();

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
    onButtonClick(button) {
        ipcRenderer.send('msgboxButtonClick', button);
        closeCurrentElectronWindow();
    }

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
            <TitleBar key="titleBar" title={t(params.key + '.title')} icon={false} buttons={false} colorClass={params.type}/>,
            <div key="content" className="row text">
                <div className="column">
                    {t(params.key + '.text')}
                </div>
            </div>,
            <div key="buttons" className={'row buttons ' + params.type}>
                {buttons.map(button => {
                    return <button key={button} onClick={() => {this.onButtonClick(button)}} className={'btn btn-text btn-' + button}>{t('messageBox:buttons.' + button)}</button>;
                })}
            </div>
        ];
    }
}

MessageBox = withTranslation()(MessageBox);

export {MessageBox, MessageBoxPath, MessageBoxSettings};
