import {getBrowserWindow, isElectron} from './electron';
import {MessageBoxPath, MessageBoxSettings} from '../components/windows/MessageBox';
import queryString from 'query-string';
const path = require('path');

const MSGBOX_TYPE_INFO = 'info';
const MSGBOX_TYPE_WARNING = 'warning';
const MSGBOX_TYPE_ERROR = 'error';

const MSGBOX_BUTTONS_OK = ['ok'];
const MSGBOX_BUTTONS_YES_NO = ['no', 'yes'];
const MSGBOX_BUTTONS_OK_CANCEL = ['cancel', 'ok'];

function showMessageBox(messageTranslationKey, type = MSGBOX_TYPE_INFO, buttons = MSGBOX_BUTTONS_OK, onClose = null) {
    if (isElectron()) {
        const BrowserWindow = getBrowserWindow();

        let messageBox = new BrowserWindow(MessageBoxSettings);

        const queryParams = queryString.stringify({
            key: messageTranslationKey,
            type: type,
            buttons: buttons,
        });
        messageBox.loadURL(`file://${path.join(__dirname, '../build/index.html#') + MessageBoxPath + '?' + queryParams}`);

        messageBox.once('ready-to-show', e => {
            messageBox.show();
        });

        messageBox.once('closed', e => {
            if (onClose)
                onClose();

            messageBox = null;
        });
    } else {
        alert(messageTranslationKey);
    }
}

export {showMessageBox, MSGBOX_TYPE_INFO, MSGBOX_TYPE_WARNING, MSGBOX_TYPE_ERROR, MSGBOX_BUTTONS_OK, MSGBOX_BUTTONS_YES_NO, MSGBOX_BUTTONS_OK_CANCEL}