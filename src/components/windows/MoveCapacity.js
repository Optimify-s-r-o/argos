import React from 'react';
import './MoveCapacity.css';
import queryString from 'query-string';
import { withTranslation } from 'react-i18next';
import {closeCurrentElectronWindow, getIpcRenderer, setCurrentElectronWindowTitle} from '../../utils/electron';
const ipcRenderer = getIpcRenderer();

const METHOD_CAPACITY_ALL = 'moveAllCapacity';
const METHOD_CAPACITY_FILL = 'moveCapacityToFill';
const METHOD_CAPACITY_CUSTOM = 'moveCapacity';

const MoveCapacityPath = '/move-capacity';

const MoveCapacitySettings = {
    maximizable: false,
    resizable: false,
    closable: false,
    frame: false,
    webPreferences: {
        nodeIntegration: true
    },
    backgroundColor: '#f0f0f0',
    show: false,
    useContentSize: true,
    width: 800,
    height: 450,
};

class MoveCapacity extends React.Component {
    onClick(method, windowId) {
        const result = null; // TODO: API call result

        ipcRenderer.send('phaseMoveResult.' + windowId, result);
        closeCurrentElectronWindow();
    }

    render() {
        const { t } = this.props;
        const params = queryString.parse(this.props.location.search);

        console.log(params);

        setCurrentElectronWindowTitle(t('phaseMove.title'));
        return [
            <div key="info" className="info">
                <table>
                    <tr>
                        <td>Zakázka:</td>
                        <td>{params.jobName}</td>
                        <td>Ze dne:</td>
                        <td>{params.from}</td>
                    </tr>
                    <tr>
                        <td>Fáze:</td>
                        <td>{params.phase}</td>
                        <td>Na den:</td>
                        <td>{params.to}</td>
                    </tr>
                </table>
            </div>,
            <div key="buttons" className="buttons">
                <button onClick={() => this.onClick(METHOD_CAPACITY_ALL, params.windowId)}>All</button>
                <button onClick={() => this.onClick(METHOD_CAPACITY_FILL, params.windowId)}>Fill</button>
                <div className="customCapacity">
                    <button onClick={() => this.onClick(METHOD_CAPACITY_CUSTOM, params.windowId)}>Custom</button>
                </div>
            </div>,
            <div key="cancel" className="cancelRow">
                <button className="btn btn-text btn-cancel">Cancel</button>
            </div>
        ]
    }
}

MoveCapacity = withTranslation()(MoveCapacity);

export {MoveCapacity, MoveCapacityPath, MoveCapacitySettings};
