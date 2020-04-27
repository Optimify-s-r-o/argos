import movePhaseCapacity from '../../api/move-phase-capacity';
import NumericInput from 'react-numeric-input';
import queryString from 'query-string';
import React, { useState } from 'react';
import styled from 'styled-components';
import { TextButton } from '../../styles/global';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  closeCurrentElectronWindow,
  getIpcRenderer,
  setCurrentElectronWindowTitle,
} from '../../utils/electron';

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
    nodeIntegration: true,
  },
  backgroundColor: '#f0f0f0',
  show: false,
  useContentSize: true,
  width: 800,
  height: 450,
};

const MoveCapacity = (props) => {
  const [customCapacity, setCustomCapacity] = useState(0);
  const { t } = useTranslation();
  const location = useLocation();

  const onClick = (method, windowId) => {
    const params = queryString.parse(location.search);

    movePhaseCapacity(
      params.url as string,
      params.token as string,
      params.phase as string,
      method,
      params.phaseId as string,
      params.to as string,
      customCapacity,
      (data) => {
        ipcRenderer.send('phaseMoveResult.' + windowId, data);
        closeCurrentElectronWindow();
      }
    );
  };

  const onCancel = () => {
    closeCurrentElectronWindow();
  };

  const customCapacityChanged = (value: number) => {
    setCustomCapacity(value);
  };

  const params = queryString.parse(location.search);

  setCurrentElectronWindowTitle(t('phaseMove.title'));
  return (
    <>
      <MoveCapacityInfo>
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
      </MoveCapacityInfo>
      <MoveCapacityButtons>
        <MoveCapacityButton
          onClick={() => onClick(METHOD_CAPACITY_ALL, params.windowId)}
        >
          {t('phaseForms:moveCapacity.buttons.all')}
          <br />({params.maxCapacity})
        </MoveCapacityButton>
        <MoveCapacityButton
          onClick={() => onClick(METHOD_CAPACITY_FILL, params.windowId)}
        >
          {t('phaseForms:moveCapacity.buttons.fill')}
        </MoveCapacityButton>
        <CustomCapacity>
          <NumericInput
            onChange={customCapacityChanged}
            value={customCapacity}
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
          <MaxCapacity>&nbsp;/ {params.maxCapacity}</MaxCapacity>
          <CustomCapacityButton
            onClick={() => onClick(METHOD_CAPACITY_CUSTOM, params.windowId)}
          >
            {t('phaseForms:moveCapacity.buttons.custom')}
          </CustomCapacityButton>
        </CustomCapacity>
      </MoveCapacityButtons>
      <CancelRow>
        <CancelButton onClick={onCancel}>
          {t('messageBox:buttons.cancel')}
        </CancelButton>
      </CancelRow>
      ,
    </>
  );
};

export {
  MoveCapacity,
  MoveCapacityPath,
  MoveCapacitySettings,
  METHOD_CAPACITY_ALL,
  METHOD_CAPACITY_FILL,
  METHOD_CAPACITY_CUSTOM,
};

const MoveCapacityInfo = styled.div`
  width: 800px;
  height: 80px;

  padding: 16px 32px;

  table {
    width: 100%;

    td {
      padding: 6px 0;

      font-size: 18px;
      font-weight: 400;

      &:nth-child(1),
      &:nth-child(3) {
        width: 83px;

        font-weight: 600;
      }

      &:nth-child(2),
      &:nth-child(4) {
        width: 280px;
      }
    }
  }
`;

const MoveCapacityButtons = styled.div`
  display: flex;

  flex-direction: row;

  width: 800px;
  height: 320px;

  padding: 16px;
`;

const MoveCapacityButton = styled.button`
  flex-grow: 1;

  width: 224px;

  margin: 16px;

  background-color: #f8f8f8;
  border: 0;
  color: #0088cc;
  font-size: 18px;

  cursor: pointer;

  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #fff;
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.2);
    color: #004466;
  }
`;

const CustomCapacity = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  position: relative;

  width: 224px;

  margin: 16px;

  background-color: #f8f8f8;
  border: 0;

  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.2);
  }

  .react-numeric-input {
    position: absolute;

    top: 0;
    right: 0;
    bottom: 70%;
    left: 0;

    margin: 0;

    input {
      position: absolute;

      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      width: 100%;

      margin: 0;
      padding-right: 50%;

      background-color: #f8f8f8;
      border: 0;
      border-bottom: 1px solid #0088cc;
      font-size: 18px;
      font-weight: 400;
      text-align: right;

      transition: all 0.2s ease-in-out;

      &:hover {
        background-color: #fff;
      }
    }
  }
`;

const MaxCapacity = styled.span`
  position: absolute;

  display: flex;

  flex-direction: column;
  justify-content: center;

  top: 0;
  bottom: 70%;
  left: 50%;

  font-size: 18px;
  font-weight: 400;
  pointer-events: none;
`;

const CustomCapacityButton = styled.button`
  position: absolute;

  top: 30%;
  right: 0;
  bottom: 0;
  left: 0;

  width: 100%;

  background-color: #f8f8f8;
  border: 0;
  color: #0088cc;
  cursor: pointer;
  font-size: 18px;

  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #fff;
    color: #004466;
  }
`;

const CancelRow = styled.div`
  width: 800px;
  height: 50px;

  background-color: white;
  text-align: right;
`;

const CancelButton = styled(TextButton)`
  margin: 10px;
`;
