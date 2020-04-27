import queryString from 'query-string';
import { BrowserWindow } from 'electron';
import {
  getBrowserWindow,
  getIpcMain,
  getPath,
  isElectron
  } from './electron';
import {
  MessageBoxPath,
  MessageBoxSettings,
} from '../components/windows/MessageBox';
const uuid = require('uuid/v1');
const path = require('path');
const ipcMain = getIpcMain();

export const MSGBOX_TYPE_INFO = 'info';
export const MSGBOX_TYPE_WARNING = 'warning';
export const MSGBOX_TYPE_ERROR = 'error';

type Type = 'info' | 'warning' | 'error';

export const MSGBOX_BUTTON_OK = 'ok';
export const MSGBOX_BUTTON_YES = 'yes';
export const MSGBOX_BUTTON_NO = 'no';
export const MSGBOX_BUTTON_CANCEL = 'cancel';

type Buttons = 'ok' | 'yes' | 'no' | 'cancel';

export const MSGBOX_BUTTONS_OK = [MSGBOX_BUTTON_OK];
export const MSGBOX_BUTTONS_YES_NO = [MSGBOX_BUTTON_NO, MSGBOX_BUTTON_YES];
export const MSGBOX_BUTTONS_OK_CANCEL = [
  MSGBOX_BUTTON_CANCEL,
  MSGBOX_BUTTON_OK,
];

export function showMessageBox(
  messageTranslationKey: string,
  type: Type = MSGBOX_TYPE_INFO,
  buttons: Array<string> = MSGBOX_BUTTONS_OK,
  onClick?: (button: Buttons) => void
) {
  if (isElectron()) {
    const BrowserWindow = getBrowserWindow();

    let messageBox = new BrowserWindow(MessageBoxSettings);
    let windowId = uuid();

    const queryParams = queryString.stringify({
      key: messageTranslationKey,
      type: type,
      buttons: buttons,
      windowId: windowId,
    });
    messageBox.loadURL(
      `file://${
        path.join(getPath(), '/build/index.html#') +
        MessageBoxPath +
        '?' +
        queryParams
      }`
    );

    messageBox.once('ready-to-show', (e: BrowserWindow) => {
      messageBox.show();
    });

    ipcMain.once('msgboxButtonClick.' + windowId, (e, button: Buttons) => {
      if (onClick) onClick(button);
    });

    messageBox.once('closed', (e: BrowserWindow) => {
      messageBox = null;
    });
  } else {
    alert(messageTranslationKey);
  }
}
