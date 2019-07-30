import React from 'react';
import minimize from '../../icons/minimize.png';
import maximize from '../../icons/maximize.png';
import maximized from '../../icons/maximized.png';
import close from '../../icons/close.png';

const isElectron = typeof window.require === 'function';
let w = null;

if (isElectron) {
    w = window.require('electron').remote.getCurrentWindow();

    w.on('maximize', (e) => {
        document.getElementById('Maximize').children[0].src = maximized;
        document.body.classList.remove('border');
    });

    w.on('unmaximize', (e) => {
        document.getElementById('Maximize').children[0].src = maximize;
        document.body.classList.add('border');
    });
}


class TitleBar extends React.Component {
    render() {
        return <div id="TitleBar">
            <div id="Icon">&nbsp;</div>
            <div id="AppName">{this.props.title}</div>
            <div id="Buttons">
                <button id="Minimize" onClick={this.handleMinimize}><img src={minimize} alt="Minimize"/></button>
                <button id="Maximize" onClick={this.handleMaximize}><img src={maximized} alt="Maximized"/></button>
                <button id="Close" onClick={this.handleClose}><img src={close} alt="Close"/></button>
            </div>
        </div>
    }

    handleMinimize() {
        if (w !== null)
            w.minimize();
    }

    handleMaximize() {
        if (w !== null) {
            if (w.isMaximized())
                w.unmaximize();
            else
                w.maximize();
        }
    }

    handleClose() {
        if (w !== null)
            w.close();
    }
}

export default TitleBar;