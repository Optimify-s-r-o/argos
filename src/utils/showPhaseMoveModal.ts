import queryString from 'query-string';
import {
  getBrowserWindow,
  getIpcMain,
  getPath,
  isElectron
  } from './electron';
import {
  MoveCapacityPath,
  MoveCapacitySettings,
} from '../components/windows/MoveCapacity';
const uuid = require('uuid/v1');
const path = require('path');
const ipcMain = getIpcMain();

function showPhaseMoveModal(
  url: string,
  token: string,
  jobName: string,
  phase: string,
  phaseId: string,
  from: string,
  to: string,
  maxMovedCapacity: string,
  onResult?: (data: any) => void
) {
  if (isElectron()) {
    const BrowserWindow = getBrowserWindow();

    let window = new BrowserWindow(MoveCapacitySettings);
    const windowId = uuid();

    const queryParams = queryString.stringify({
      url: url,
      token: token,
      jobName: jobName,
      phase: phase,
      phaseId: phaseId,
      from: from,
      to: to,
      windowId: windowId,
      maxCapacity: maxMovedCapacity,
    });
    window.loadURL(
      `file://${
        path.join(getPath(), '/build/index.html#') +
        MoveCapacityPath +
        '?' +
        queryParams
      }`
    );

    window.once('ready-to-show', (e) => {
      window.show();
    });

    ipcMain.once('phaseMoveResult.' + windowId, (e, data) => {
      if (onResult) onResult(data);
    });

    window.once('closed', (e) => {
      window = null;
    });
  } else {
    alert('Modal is now open');
  }
}

export default showPhaseMoveModal;
