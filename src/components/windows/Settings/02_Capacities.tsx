import FormRow from '../../forms/FormRow';
import getSettings from '../../../api/get-settings';
import NumericInput from 'react-numeric-input';
import React, { useEffect, useState } from 'react';
import saveSetting from '../../../api/save-setting';
import styled from 'styled-components';
import { getColorWithOpacity } from '../../../styles/theme';
import { showMessageBox } from '../../../utils/showMessageBox';
import { TextButton } from '../../../styles/global';
import { useTranslation } from 'react-i18next';

interface CapacitiesProps {
  token: string;
  url: string;
}

const Capacities = (props: CapacitiesProps) => {
  const { t } = useTranslation();
  const phases = ['saw', 'press', 'construction']; // TODO: change to external constant

  const [saveEnabled, setSaveEnabled] = useState(false);
  const [settings, setSettings] = useState({});
  const [settingsEdited, setSettingsEdited] = useState({});

  useEffect(() => {
    if (props.url && props.token)
      getSettings(props.url as string, props.token as string, (data) => {
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
        saveSetting(
          props.url,
          props.token,
          key,
          settingsEdited[key],
          (result) => {
            if (result.status === 200) {
              let settingsNew = Object.assign({}, settings);
              settingsNew[key] = settingsEdited[key];
              setSettings(settingsNew);

              let settingsEditedNew = Object.assign({}, settingsEdited);
              delete settingsEditedNew[key];
              setSettingsEdited(settingsEditedNew);
            }
          }
        );
        return null;
      });
    }

    showMessageBox('settings:saved');
    setSaveEnabled(false);
  };

  return (
    <>
      {phases.map((phase) => {
        return (
          <FormRow title={t('settings:capacities.' + phase)}>
            <SettingsRowCapacity>
              <OriginalCapacity>
                {settings[phase + 'DefaultCapacity']}
              </OriginalCapacity>
              {settingsEdited.hasOwnProperty(phase + 'DefaultCapacity') ? (
                [
                  <HorizontalArrow>→</HorizontalArrow>,
                  <NumericInput
                    value={settingsEdited[phase + 'DefaultCapacity']}
                    onChange={(value) => {
                      numericInputChanged(phase + 'DefaultCapacity', value);
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
                <TextButton onClick={() => edit(phase + 'DefaultCapacity')}>
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
    </>
  );
};

export default Capacities;

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
