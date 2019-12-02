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

function closeCurrentElectronWindow() {
    if (isElectron()) {
        const w = window.require('electron').remote.getCurrentWindow();
        w.setClosable(true);
        w.close();
    }
}

function setCurrentElectronWindowTitle(title) {
    if (isElectron())
        window.require('electron').remote.getCurrentWindow().setTitle(title);
}

function getDialog() {
    let dialog;

    if (isElectron())
        dialog = window.require('electron').remote.dialog;

    return dialog;
}

function getPath() {
    let path;

    if (isElectron())
        path = window.require('electron').remote.app.getAppPath();

    return path;
}

export {isElectron, getBrowserWindow, getIpcMain, getIpcRenderer, closeCurrentElectronWindow, setCurrentElectronWindowTitle, getDialog, getPath};