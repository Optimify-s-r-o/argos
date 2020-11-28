import getSettings from '../../api/get-settings';
import NumericInput from 'react-numeric-input';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import saveSetting from '../../api/save-setting';
import styled from 'styled-components';
import TitleBar from '../TitleBar';
import truncateMiddle from 'truncate-middle';
import { FormCard, FormCardHeader, FormColumn } from '../../styles/forms';
import { getColorWithOpacity } from '../../styles/theme';
import { Row, TextButton } from '../../styles/global';
import { showMessageBox } from '../../utils/showMessageBox';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import FormRow, {
  FormCardRow,
  FormCardRowHeader,
  FormCardRowContent,
} from '../forms/FormRow';
import {
  getDialog,
  getIpcRenderer,
  setCurrentElectronWindowTitle,
} from '../../utils/electron';

const ipcRenderer = getIpcRenderer();
const dialog = getDialog();

const SettingsPath = '/settings';

const SettingsSettings = {
  width: 602,
  height: 542,
  maximizable: false,
  resizable: false,
};

const NumericInputStyles = {
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
};

const Settings = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const params = queryString.parse(location.search);

  const [token] = useState(params.token as string);
  const [url] = useState(params.url as string);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [pambaPath, setPambaPath] = useState(params.pambaPath as string);
  const [pambaPathOriginal, setPambaPathOriginal] = useState(
    params.pambaPath as string
  );
  const [settings, setSettings] = useState({});
  const [settingsEdited, setSettingsEdited] = useState({});

  useEffect(() => {
    const params = queryString.parse(location.search);

    if (params.url && params.token)
      getSettings(params.url as string, params.token as string, (data) => {
        setSettings(data.body);
      });
    else alert('ERROR in Settings component!');
  }, []);

  useEffect(() => {
    setSaveStatus();
  }, [pambaPath, pambaPathOriginal, settingsEdited]);

  const setSaveStatus = () => {
    if (
      pambaPath !== pambaPathOriginal ||
      Object.keys(settingsEdited).length > 0
    )
      setSaveEnabled(true);
    else setSaveEnabled(false);
  };

  const numericInputChanged = (setting, value) => {
    setSettingsEdited(
      Object.assign(settingsEdited, {
        [setting]: value,
      })
    );
  };

  const openFolderSelection = () => {
    if (dialog) {
      let path = dialog.showOpenDialogSync({
        properties: ['openDirectory'],
      })[0];

      setPambaPath(path);
    }
  };

  const revertPambaPath = () => {
    setPambaPath(pambaPathOriginal);
  };

  const edit = (setting) => {
    if (settings.hasOwnProperty(setting))
      setSettingsEdited(
        Object.assign({}, settingsEdited, { [setting]: settings[setting] })
      );
  };

  const cancelEdit = (setting) => {
    if (settingsEdited.hasOwnProperty(setting)) {
      let settingsEditedNew = Object.assign({}, settingsEdited);
      delete settingsEditedNew[setting];
      setSettingsEdited(settingsEditedNew);
    }
  };

  const save = () => {
    if (pambaPath !== pambaPathOriginal) {
      ipcRenderer.send('setPambaPath', pambaPath);
      setPambaPathOriginal(pambaPath);
    }

    if (Object.keys(settingsEdited).length > 0) {
      Object.keys(settingsEdited).map((key) => {
        saveSetting(url, token, key, settingsEdited[key], (result) => {
          if (result.status === 200) {
            let settingsNew = Object.assign({}, settings);
            settingsNew[key] = settingsEdited[key];
            setSettings(settingsNew);

            let settingsEditedNew = Object.assign({}, settingsEdited);
            delete settingsEditedNew[key];
            setSettingsEdited(settingsEditedNew);
          }
        });
        return null;
      });
    }

    showMessageBox('settings:saved');
    setSaveEnabled(false);
  };

  setCurrentElectronWindowTitle(t('settings:title'));

  const phases = ['saw', 'press', 'construction']; // TODO: change to external constant

  return (
    <>
      <TitleBar title={t('settings:title')} icon={false} />
      <Row>
        <SettingsColumn>
          <FormCard>
            <FormCardHeader>{t('settings:common.header')}</FormCardHeader>

            <PambaRow>
              <FormCardRowHeader>
                {t('settings:common.pambaPath')}
              </FormCardRowHeader>
              <FormCardRowContent>
                <SettingsRow>
                  <PambaPathColumn>
                    <Original>
                      {truncateMiddle(
                        pambaPathOriginal ? pambaPathOriginal : '',
                        30,
                        30,
                        '. . .'
                      )}
                    </Original>
                    {pambaPath !== pambaPathOriginal
                      ? [
                          <VerticalArrow>↓</VerticalArrow>,
                          <New>
                            {truncateMiddle(
                              pambaPath ? pambaPath : '',
                              30,
                              30,
                              '. . .'
                            )}
                          </New>,
                        ]
                      : ''}
                  </PambaPathColumn>
                  <PambaPathColumn>
                    <TextButton onClick={openFolderSelection}>
                      {t('settings:common.pambaPathChange')}
                    </TextButton>
                    {pambaPath !== pambaPathOriginal ? (
                      <CancelEditingPamba onClick={() => revertPambaPath()}>
                        🞨
                      </CancelEditingPamba>
                    ) : (
                      ''
                    )}
                  </PambaPathColumn>
                </SettingsRow>
              </FormCardRowContent>
            </PambaRow>

            <FormCardHeader>{t('settings:capacities.header')}</FormCardHeader>

            {phases.map((phase) => {
              return (
                <FormRow title={t('settings:capacities.' + phase)}>
                  <SettingsRowCapacity>
                    <OriginalCapacity>
                      {settings[phase + 'DefaultCapacity']}
                    </OriginalCapacity>
                    {settingsEdited.hasOwnProperty(
                      phase + 'DefaultCapacity'
                    ) ? (
                      [
                        <HorizontalArrow>→</HorizontalArrow>,
                        <NumericInput
                          value={settingsEdited[phase + 'DefaultCapacity']}
                          onChange={(value) => {
                            numericInputChanged(
                              phase + 'DefaultCapacity',
                              value
                            );
                          }}
                          min={0}
                          step={1}
                          strict={true}
                          style={NumericInputStyles}
                        />,
                        <CancelEditing
                          onClick={() => cancelEdit(phase + 'DefaultCapacity')}
                        >
                          🞨
                        </CancelEditing>,
                      ]
                    ) : (
                      <TextButton
                        onClick={() => edit(phase + 'DefaultCapacity')}
                      >
                        {t('settings:capacities.edit')}
                      </TextButton>
                    )}
                  </SettingsRowCapacity>
                </FormRow>
              );
            })}

            <FormRow border={false}>
              <TextButton disabled={!saveEnabled} onClick={save}>
                {t('settings:save')}
              </TextButton>
            </FormRow>
          </FormCard>
        </SettingsColumn>
      </Row>
    </>
  );
};

export { Settings, SettingsPath, SettingsSettings };

const SettingsColumn = styled(FormColumn)`
  width: 600px;
  align-items: stretch;

  ${FormCard} {
    display: flex;
    flex-direction: column;
  }

  ${FormCardRow} {
    display: flex;
    flex-direction: row;

    width: 100%;

    ${FormCardRowHeader} {
      width: 30%;
    }

    ${FormCardRowContent} {
      width: 70%;
    }
  }
`;

const PambaRow = styled(FormCardRow)`
  flex-direction: column !important;

  ${FormCardRowHeader},
  ${FormCardRowContent} {
    width: 100% !important;
  }
`;

const PambaPathColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const SettingsRow = styled.div`
  display: flex;

  flex-direction: row;
  justify-content: flex-end;

  div:first-child {
    flex-grow: 1;
  }

  div:last-child {
    display: flex;

    flex-direction: column;
  }

  ${TextButton} {
    margin: -6px 16px;
  }
`;

const SettingsRowCapacity = styled.div`
  display: flex;

  flex-direction: row;
  justify-content: flex-end;

  ${TextButton} {
    margin: -6px 16px;
  }

  .react-numeric-input {
    position: relative;

    margin: -7px 6px -8px;
  }

  .react-numeric-input input {
    margin: 0;

    width: 76px;
  }
`;

const CancelEditing = styled.button`
  margin: -4px 42px -3px 30px !important;
  padding: 3px 7px 5px 7px;

  background-color: transparent;
  border: 0;
  border-radius: 50%;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  font-weight: 700;

  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.accent};
  }
`;

const CancelEditingPamba = styled(CancelEditing)`
  display: block;

  margin: 0 0 -4px 0 !important;

  width: 27px;
`;

const VerticalArrow = styled.div`
  margin: 4px 0 -4px;
`;

const HorizontalArrow = styled.div`
  margin: 0 4px;
`;

const Original = styled.div`
  color: ${(props) => getColorWithOpacity(props.theme.colors.black, 40)};
  min-width: 30px;
`;

const OriginalCapacity = styled(Original)`
  width: 40px;

  text-align: right;
`;

const New = styled.div`
  margin-top: 8px;
`;
