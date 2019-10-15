function isElectron() {
    return typeof window.require === 'function';
}

function getBrowserWindow() {
    let BrowserWindow;
    if (isElectron())
        BrowserWindow = window.require('electron').remote.BrowserWindow;

    return BrowserWindow;
}

function getIpcMain() {
    let ipcMain;
    if (isElectron())
        ipcMain = window.require('electron').remote.ipcMain;

    return ipcMain;
}

function getIpcRenderer() {
    let ipcRenderer;
    if (isElectron())
        ipcRenderer = window.require('electron').ipcRenderer;

    return ipcRenderer;
}

export {isElectron, getBrowserWindow, getIpcMain, getIpcRenderer};