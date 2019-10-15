const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

function createWindow () {
    let window =
        new BrowserWindow({
            minWidth: 1024,
            show: false,
            frame: false,
            webPreferences: {
                nodeIntegration: true
            },
            backgroundColor: '#FFFFFF',
            title: 'Argos planner'
        });

    window.maximize();

    //window.loadURL('http://localhost:3000/');
    window.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);

    window.on('ready-to-show', (e) => {
        window.show();
    });

    ipcMain.on('event', (e, event, data) => {
        window.webContents.send('event-fired', event, data);
    });
}

app.on('ready', createWindow);