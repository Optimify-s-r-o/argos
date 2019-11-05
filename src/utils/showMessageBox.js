import {getBrowserWindow, getIpcMain, isElectron} from './electron';
import {MessageBoxPath, MessageBoxSettings} from '../components/windows/MessageBox';
import queryString from 'query-string';
const path = require('path');
const ipcMain = getIpcMain();

const MSGBOX_TYPE_INFO = 'info';
const MSGBOX_TYPE_WARNING = 'warning';
const MSGBOX_TYPE_ERROR = 'error';

const MSGBOX_BUTTON_OK = 'ok';
const MSGBOX_BUTTON_YES = 'yes';
const MSGBOX_BUTTON_NO = 'no';
const MSGBOX_BUTTON_CANCEL = 'cancel';

const MSGBOX_BUTTONS_OK = [MSGBOX_BUTTON_OK];
const MSGBOX_BUTTONS_YES_NO = [MSGBOX_BUTTON_NO, MSGBOX_BUTTON_YES];
const MSGBOX_BUTTONS_OK_CANCEL = [MSGBOX_BUTTON_CANCEL, MSGBOX_BUTTON_OK];

function showMessageBox(messageTranslationKey, type = MSGBOX_TYPE_INFO, buttons = MSGBOX_BUTTONS_OK, onClick = null) {
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

        ipcMain.once('msgboxButtonClick', (e, button) => {
            if (onClick)
                onClick(button);
        });

        messageBox.once('closed', e => {
            messageBox = null;
        });
    } else {
        alert(messageTranslationKey);
    }
}

export {showMessageBox, MSGBOX_TYPE_INFO, MSGBOX_TYPE_WARNING, MSGBOX_TYPE_ERROR,
    MSGBOX_BUTTON_OK, MSGBOX_BUTTON_YES, MSGBOX_BUTTON_NO, MSGBOX_BUTTON_CANCEL,
    MSGBOX_BUTTONS_OK, MSGBOX_BUTTONS_YES_NO, MSGBOX_BUTTONS_OK_CANCEL}