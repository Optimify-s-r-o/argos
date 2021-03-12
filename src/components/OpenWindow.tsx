import pathLib from 'path';
import React from 'react';
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { connect } from 'react-redux';
import { defaultTheme, getMultipliedColor } from '../styles/theme';
import { getBrowserWindow, getPath } from '../utils/electron';

interface OpenWindowProps {
	children: React.ReactNode;
	path: string;
	windowSettings?: BrowserWindowConstructorOptions;
	onOpen?: (window: BrowserWindow) => void;
	onClose?: () => void;
}

const BrowserWindowClass = getBrowserWindow();

const defaultSettings = {
	frame: false,
	webPreferences: {
		nodeIntegration: true,
	},
	backgroundColor: getMultipliedColor(defaultTheme.colors.white, 0.94),
	show: false,
	minWidth: 320,
	useContentSize: true,
};

export const openWindow = (
	path: string,
	windowSettings?: BrowserWindowConstructorOptions,
	onOpen?: (window: BrowserWindow) => void,
	onClose?: () => void
) => {
	if (BrowserWindowClass !== undefined) {
		let options;
		if (windowSettings)
			options = Object.assign({}, defaultSettings, windowSettings);
		else options = defaultSettings;

		let w = new BrowserWindowClass(options);

		w.loadURL(`file://${pathLib.join(getPath(), "/build/index.html#") + path}`);

		w.once("ready-to-show", (e: Electron.Event) => {
			w.show();
			if (onOpen) onOpen(w);
		});

		w.once("closed", (e: Electron.Event) => {
			w = null;
			if (onClose) onClose();
		});
	}
};

const OpenWindowComponent = (props: OpenWindowProps) => {
	return (
		<div
			onClick={() =>
				openWindow(
					props.path,
					props.windowSettings,
					props.onOpen,
					props.onClose
				)
			}
		>
			{props.children}
		</div>
	);
};

const OpenWindow = connect()(OpenWindowComponent);

export default OpenWindow;
