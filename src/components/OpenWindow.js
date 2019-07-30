import React from 'react';
import {connect} from 'react-redux';
const path = require('path');

const isElectron = typeof window.require === 'function';

let BrowserWindow;
if (isElectron)
    BrowserWindow = window.require('electron').remote.BrowserWindow;

const defaultOptions = {
    frame: false,
    webPreferences: {
        nodeIntegration: true
    },
    backgroundColor: '#f0f0f0',
    show: false,
    minWidth: 320,
    useContentSize: true,
    title: 'test'
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
        if (isElectron && BrowserWindow !== null && this.props.hasOwnProperty('path')) {
            let options;
            if (this.props.hasOwnProperty('windowOptions'))
                options = Object.assign({}, defaultOptions, this.props.windowOptions);
            else
                options = defaultOptions;

            let w = new BrowserWindow(options);

            w.loadURL(`file://${path.join(__dirname, '../build/index.html#') + this.props.path}`);

            w.on('ready-to-show', (e) => {
                w.show();
            });
        }
    }
}

const OpenWindow = connect()(OpenWindowComponent);

export default OpenWindow;