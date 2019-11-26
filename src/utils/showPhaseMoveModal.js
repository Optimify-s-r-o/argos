import {getBrowserWindow, getIpcMain, isElectron} from './electron';
import queryString from 'query-string';
import {MoveCapacityPath, MoveCapacitySettings} from '../components/windows/MoveCapacity';
const uuid = require('uuid/v1');
const path = require('path');
const ipcMain = getIpcMain();

function showPhaseMoveModal(jobName, phase, phaseId, from, to, onResult = null) {
    if (isElectron()) {
        const BrowserWindow = getBrowserWindow();

        let window = new BrowserWindow(MoveCapacitySettings);
        const windowId = uuid();

        const queryParams = queryString.stringify({
            jobName: jobName,
            phase: phase,
            phaseId: phaseId,
            from: from,
            to: to,
            windowId: windowId,
        });
        window.loadURL(`file://${path.join(__dirname, '../build/index.html#') + MoveCapacityPath + '?' + queryParams}`);

        window.once('ready-to-show', e => {
            window.show();
        });

        ipcMain.once('phaseMoveResult.' + windowId, (e, data) => {
            if (onResult)
                onResult(data);
        });

        window.once('closed', e => {
            window = null;
        });
    } else {
        alert('Modal is now open');
    }
}

export default showPhaseMoveModal;