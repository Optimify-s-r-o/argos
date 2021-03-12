const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const execFile = require('child_process').execFile;
const { autoUpdater } = require("electron-updater")
const log = require('electron-log');

try {
  require('electron-reloader')(module, {
    watchRenderer: true,
  });
} catch (_) {
  console.log('Error');
}

function createWindow() {
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  autoUpdater.autoDownload=false;

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

  
  ipcMain.on('CHECK_FOR_UPDATE_PENDING', (event) => {
    const { sender } = event;
    logInfo('CHECK_FOR_UPDATE_PENDING');
    autoUpdater.autoDownload=false;
  if (process.env.NODE_ENV === 'development') {
    sender.send('CHECK_FOR_UPDATE_SUCCESS');
  } else {
    const result = autoUpdater.checkForUpdates();
    log.info(result);
    result
      .then((checkResult) => {
        const { updateInfo } = checkResult;
        logInfo('CHECK_FOR_UPDATE_SUCCESS:')
        logInfo(updateInfo)
        sender.send("CHECK_FOR_UPDATE_SUCCESS", updateInfo);
      })
      .catch((error) => {
        logInfo('CHECK_FOR_UPDATE_FAILURE:')
        logInfo(error);
        sender.send("CHECK_FOR_UPDATE_SUCCESS");
      });
  }
  });

  ipcMain.on("DOWNLOAD_UPDATE_PENDING", event => {
    const result = autoUpdater.downloadUpdate();
    const { sender } = event;
  
    result
      .then(() => {
        logInfo("DOWNLOAD_UPDATE_SUCCESS");
        sender.send("DOWNLOAD_UPDATE_SUCCESS");
      })
      .catch((error) => {
        logInfo("DOWNLOAD_UPDATE_FAILURE:");
        logInfo(error);
        sender.send("DOWNLOAD_UPDATE_SUCCESS");
      });
  });
  
  autoUpdater.on('update-downloaded', (info) => {
    logInfo('Update downloaded');
    autoUpdater.quitAndInstall();
  });

  ipcMain.on('APP_VERSION', (event) => {
    logInfo('APP_VERSION'+app.getVersion())
    event.sender.send('APP_VERSION', { version: app.getVersion() });
  });

}

function runProxyServer() {
  let pathLevel = '../';
  if (process.argv[2] !== '--dev') {
    pathLevel += '../../';
  }

  return execFile(
    path.join(
      __dirname,
      pathLevel + 'bin/proxy/Argos.LocalProxy.Mitek.Api.exe'
    ),
    {
      cwd: path.join(__dirname, pathLevel + 'bin/proxy'),
    },
    (err, data) => {
      //throw err;
      /*console.log(err);
        console.log(data.toString());*/
    }
  );
}


app.on('ready', createWindow);
