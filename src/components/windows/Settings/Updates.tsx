import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getIpcRenderer } from '../../../utils/electron';
import {
	APP_VERSION,
	CHECK_FOR_UPDATE_FAILURE,
	CHECK_FOR_UPDATE_PENDING,
	CHECK_FOR_UPDATE_SUCCESS,
	DOWNLOAD_UPDATE_FAILURE,
	DOWNLOAD_UPDATE_PENDING,
	DOWNLOAD_UPDATE_SUCCESS,
} from "../../../types/ipcConstants";

export enum State {
	PENDING,
	DOWNLOADING,
	NEW_VERSION_TO_DOWNLOAD,
	IS_UPDATED,
	DOWNLOADED,
	UPDATING,
	FAILURE,
}

export const Updates = () => {
	const [currentAppVersion, setVersion] = useState(null);
	const [versionToDownload, setVersionToDownload] = useState(null);
	const [updatingState, setUpdatingState] = useState(State.PENDING);

	useEffect(() => {
		const ipcRenderer = getIpcRenderer();
		ipcRenderer.send(APP_VERSION);

		ipcRenderer.on(APP_VERSION, (event, text) => {
			setVersion(text?.version);
		});
	}, []);

	useEffect(() => {
		const ipcRenderer = getIpcRenderer();
		ipcRenderer.send(CHECK_FOR_UPDATE_PENDING);

		ipcRenderer.on(CHECK_FOR_UPDATE_SUCCESS, (event, updateInfo) => {
			const version = updateInfo && updateInfo.version;
			if (currentAppVersion && version && version !== currentAppVersion) {
				setVersionToDownload(version);
				setUpdatingState(State.NEW_VERSION_TO_DOWNLOAD);
			} else {
				setUpdatingState(State.IS_UPDATED);
			}
		});

		ipcRenderer.on(CHECK_FOR_UPDATE_FAILURE, () => {
			setUpdatingState(State.FAILURE);
		});

		ipcRenderer.on(DOWNLOAD_UPDATE_SUCCESS, () => {
			setUpdatingState(State.DOWNLOADED);
		});

		ipcRenderer.on(DOWNLOAD_UPDATE_FAILURE, () => {
			setUpdatingState(State.FAILURE);
		});
	}, [currentAppVersion]);

	const updateApp = () => {
		const ipcRenderer = getIpcRenderer();
		ipcRenderer.send(DOWNLOAD_UPDATE_PENDING);
		setUpdatingState(State.UPDATING);
	};

	return (
		<>
			<AlertBox>
				{updatingState === State.PENDING ? (
					<Message>Checking for updates...</Message>
				) : updatingState === State.NEW_VERSION_TO_DOWNLOAD ? (
					<>
						<Info>New version found: {versionToDownload}</Info>
					</>
				) : updatingState === State.DOWNLOADED ? (
					<Message>Update successfully downloaded.</Message>
				) : updatingState === State.UPDATING ? (
					<>
						<Info>Updating...</Info>
						<Description>
							This may take a while. When a new update is downloaded TRUSS
							Project Manager will automatically restart.
						</Description>
					</>
				) : updatingState === State.IS_UPDATED ? (
					<Message>Your app is up to date.</Message>
				) : updatingState === State.FAILURE ? (
					<Message>Error</Message>
				) : (
					""
				)}
				{(updatingState === State.PENDING ||
					updatingState === State.UPDATING) && <div>LOADING TODO ADD ICON</div>}
				{updatingState === State.NEW_VERSION_TO_DOWNLOAD && (
					<SButton onClick={() => updateApp()}>Download & Install now</SButton>
				)}
			</AlertBox>
		</>
	);
};

const Description = styled.span`
	color: ${(props) => props.theme.colors.secondaryText.default};
	margin: 0.3em 0 1.3em 0;
`;

const Info = styled.span`
	color: ${(props) => props.theme.colors.secondaryText.default};
	margin: 1.3em 0 0.3em 0;
`;

const Message = styled.span`
	color: ${(props) => props.theme.colors.secondaryText.default};
	margin: 1.3em 0;
`;

const AlertBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-direction: column;
	margin: 1em 0;
	.anticon svg {
		background: transparent;
	}
`;

const SButton = styled.button`
	margin: 0.4em 0 0.4em 0;
	.anticon svg {
		background: transparent;
	}
`;
