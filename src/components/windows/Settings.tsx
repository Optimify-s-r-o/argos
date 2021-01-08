import getSettings from '../../api/get-settings';
import NumericInput from 'react-numeric-input';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import saveSetting from '../../api/save-setting';
import styled from 'styled-components';
import TitleBar from '../TitleBar';
import { FormCard, FormBackground } from '../../styles/forms';
import { getColorWithOpacity } from '../../styles/theme';
import { Row, TextButton } from '../../styles/global';
import { showMessageBox } from '../../utils/showMessageBox';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import FormRow from '../forms/FormRow';
import { setCurrentElectronWindowTitle } from '../../utils/electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCogs,
  faSlidersH,
  faBriefcase,
} from '@fortawesome/free-solid-svg-icons';

const SettingsPath = '/settings';

const SettingsSettings = {
  width: 657,
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
  }, [settingsEdited]);

  const setSaveStatus = () => {
    if (Object.keys(settingsEdited).length > 0) setSaveEnabled(true);
    else setSaveEnabled(false);
  };

  const numericInputChanged = (setting, value) => {
    setSettingsEdited(
      Object.assign(settingsEdited, {
        [setting]: value,
      })
    );
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
    <FormBackground>
      <TitleBar title={t('settings:title')} icon={false} />
      <Row>
        <SettingsWrapper>
          <SettingsCategories>
            <Category isActive>
              <FontAwesomeIcon icon={faCogs} /> Obecné
            </Category>
            <Category>
              <FontAwesomeIcon icon={faSlidersH} /> Kapacity
            </Category>
            <Category>
              <FontAwesomeIcon icon={faBriefcase} /> Směny
            </Category>
          </SettingsCategories>

          <SettingsContent>
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
          </SettingsContent>
        </SettingsWrapper>
      </Row>
    </FormBackground>
  );
};

export { Settings, SettingsPath, SettingsSettings };

const SettingsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;

  padding: 32px;
`;

const SettingsCategories = styled.div`
  width: 200px;

  background: ${(props) => getColorWithOpacity(props.theme.colors.white, 10)};
`;

const Category = styled.div<{ isActive: boolean }>`
  padding: 16px 24px;

  background: ${(props) =>
    props.isActive
      ? getColorWithOpacity(props.theme.colors.white, 10)
      : 'transparent'};
  color: ${(props) => getColorWithOpacity(props.theme.colors.white, 80)};

  transition: all 0.2s ease-out;

  svg {
    margin-right: 8px;
  }

  &:hover {
    color: ${(props) => props.theme.colors.white};
  }
`;

const SettingsContent = styled(FormCard)`
  width: 392px;
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

/*const VerticalArrow = styled.div`
  margin: 4px 0 -4px;
`;*/

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
