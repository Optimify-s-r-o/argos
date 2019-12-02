import React from 'react';
import {connect} from 'react-redux';
import {getBrowserWindow, getPath, isElectron} from '../utils/electron';
const path = require('path');

const BrowserWindow = getBrowserWindow();

/*const ipcRenderer = getIpcRenderer();

ipcRenderer.on('event-fired', (e, event, data) => {
    console.log(event);
    console.log(data);
});*/

const defaultSettings = {
    frame: false,
    webPreferences: {
        nodeIntegration: true
    },
    backgroundColor: '#f0f0f0',
    show: false,
    minWidth: 320,
    useContentSize: true,
};

/**
 * Props:
 * - path: path to open in new window
 * - windowOptions: options for the browser window object
 */
class OpenWindowComponent extends React.Component {
    constructor(props) {
        super(props);

        this.openWindow = this.openWindow.bind(this);
    }

    render() {
        return <div onClick={() => this.openWindow()}>
            {this.props.children}
        </div>;
    }

    openWindow() {
        if (BrowserWindow !== undefined && this.props.hasOwnProperty('path')) {
            let options;
            if (this.props.hasOwnProperty('windowSettings'))
                options = Object.assign({}, defaultSettings, this.props.windowSettings);
            else
                options = defaultSettings;

            let w = new BrowserWindow(options);

            w.loadURL(`file://${path.join(getPath(), '/build/index.html#') + this.props.path}`);

            w.once('ready-to-show', e => {
                w.show();
            });

            w.once('closed', e => {
                w = null;
            });
        }
    }
}

const OpenWindow = connect()(OpenWindowComponent);

export default OpenWindow;