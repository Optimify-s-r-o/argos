import React from 'react';
import './MoveCapacity.css';
import queryString from 'query-string';
import { withTranslation } from 'react-i18next';
import {closeCurrentElectronWindow, getIpcRenderer, setCurrentElectronWindowTitle} from '../../utils/electron';
import movePhaseCapacity from '../../api/move-phase-capacity';
import NumericInput from 'react-numeric-input';
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
    constructor(props) {
        super(props);

        this.state = {
            customCapacity: 0,
        };

        this.onClick = this.onClick.bind(this);
        this.customCapacityChanged = this.customCapacityChanged.bind(this);
    }

    onClick(method, windowId) {
        const params = queryString.parse(this.props.location.search);

        movePhaseCapacity(params.token, params.phase, method, params.phaseId, params.to, this.state.customCapacity, (data) => {
            ipcRenderer.send('phaseMoveResult.' + windowId, data);
            console.log(data);
            //closeCurrentElectronWindow();
        });
    }

    onCancel() {
        closeCurrentElectronWindow();
    }

    customCapacityChanged(value) {
        this.setState({
            customCapacity: value,
        })
    }

    render() {
        const { t } = this.props;
        const params = queryString.parse(this.props.location.search);

        setCurrentElectronWindowTitle(t('phaseMove.title'));
        return [
            <div key="info" className="moveCapacityInfo">
                <table>
                    <tr>
                        <td>{t('phaseForms:moveCapacity.job')}:</td>
                        <td>{params.jobName}</td>
                        <td>{t('phaseForms:moveCapacity.from')}:</td>
                        <td>{params.from}</td>
                    </tr>
                    <tr>
                        <td>{t('phaseForms:moveCapacity.phase')}:</td>
                        <td>{params.phase}</td>
                        <td>{t('phaseForms:moveCapacity.to')}:</td>
                        <td>{params.to}</td>
                    </tr>
                </table>
            </div>,
            <div key="buttons" className="moveCapacityButtons">
                <button onClick={() => this.onClick(METHOD_CAPACITY_ALL, params.windowId)}>
                    {t('phaseForms:moveCapacity.buttons.all')}<br/>
                    ({params.maxCapacity})
                </button>
                <button onClick={() => this.onClick(METHOD_CAPACITY_FILL, params.windowId)}>
                    {t('phaseForms:moveCapacity.buttons.fill')}
                </button>
                <div className="customCapacity">
                    <NumericInput
                        onChange={this.customCapacityChanged}
                        value={this.state.customCapacity}
                        min={0}
                        max={params.maxCapacity}
                        step={1}
                        strict={true}
                        style={{
                            wrap: {
                                position: false,
                            },
                            input: {
                                paddingRight: false,
                                fontSize: false,
                            },
                            'input:not(.form-control)': {
                                border: false,
                                borderRadius: false,
                                paddingLeft: false,
                                display: false,
                                WebkitAppearance: false,
                                lineHeight: false,
                            },
                            btn: {
                                background: false,
                                boxShadow: false,
                            },
                            btnUp: {
                                borderWidth: 0,
                            },
                            btnDown: {
                                borderWidth: 0,
                            },
                        }}
                    />
                    <span className="maxCapacity">&nbsp;/ {params.maxCapacity}</span>
                    <button onClick={() => this.onClick(METHOD_CAPACITY_CUSTOM, params.windowId)}>{t('phaseForms:moveCapacity.buttons.custom')}</button>
                </div>
            </div>,
            <div key="cancel" className="cancelRow">
                <button className="btn btn-text btn-cancel" onClick={this.onCancel}>{t('messageBox:buttons.cancel')}</button>
            </div>
        ]
    }
}

MoveCapacity = withTranslation()(MoveCapacity);

export {MoveCapacity, MoveCapacityPath, MoveCapacitySettings, METHOD_CAPACITY_ALL, METHOD_CAPACITY_FILL, METHOD_CAPACITY_CUSTOM};
