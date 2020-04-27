const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const execFile = require('child_process').execFile;

function createWindow() {
  let proxyServer = runProxyServer();

  let window = new BrowserWindow({
    maximizable: false,
    minimizable: false,
    resizable: false,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'Argos planner',
    backgroundColor: '#004466',
    width: 640,
    height: 480,
  });

  //window.maximize();

  //window.loadURL('http://localhost:3000/');
  window.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);

  window.on('ready-to-show', (e) => {
    window.show();
  });

  ipcMain.on('event', (e, event, data) => {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach((w) => {
      w.webContents.send('event-fired', event, data);
    });
  });

  ipcMain.on('close-app', () => {
    app.exit();
  });

  ipcMain.handle('restartProxy', (e) => {
    proxyServer.kill();
    proxyServer = runProxyServer();
    return proxyServer;
  });
}

function runProxyServer() {
  let pathLevel = '../';
  if (process.argv[2] !== '--dev') {
    pathLevel += '../../';
  }

  return execFile(
    path.join(__dirname, pathLevel + 'bin/proxy/ArgosLocal.exe'),
    (err, data) => {
      //throw err;
      /*console.log(err);
        console.log(data.toString());*/
    }
  );
}

app.on('ready', createWindow);
