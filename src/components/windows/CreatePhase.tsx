import Cancel from '../forms/Cancel';
import phasePartCreate from '../../api/phase/create-phase-part';
import queryString from 'query-string';
import React, { useState } from 'react';
import Select from '../forms/Select';
import Submit from '../forms/Submit';
import TitleBar from '../TitleBar';
import { DatePicker } from '../forms/Calendar';
import { getDateString } from '../../utils/days';
import { Row } from '../../styles/global';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import '../../styles/main.css';
import '../../styles/forms.css';
import {
  FormBackground,
  FormCard,
  FormCardButtons,
  FormColumn,
} from '../../styles/forms';
import {
  closeCurrentElectronWindow,
  setCurrentElectronWindowTitle,
} from '../../utils/electron';
import FormRow, {
  FormInfo,
  FormInfoContent,
  FormInfoHeader,
  FormInfoRow,
} from '../forms/FormRow';
import {
  MSGBOX_BUTTONS_OK,
  MSGBOX_TYPE_SUCCESS,
  showMessageBox,
} from '../../utils/showMessageBox';

const title = 'phaseForms:create.titleBar';

const CreatePhasePath = '/create-phase';

const CreatePhasePathWithParams = (
  url: string,
  token: string,
  phase: string,
  date: string,
  jobId: string,
  jobGuid: string,
  jobLocation: string,
  jobDescription: string
) =>
  '/create-phase?url=' +
  url +
  '&token=' +
  token +
  '&phase=' +
  phase +
  '&date=' +
  date +
  '&jobId=' +
  jobId +
  '&jobGuid=' +
  jobGuid +
  '&jobLocation=' +
  jobLocation +
  '&jobDescription=' +
  jobDescription;

const CreatePhaseSettings = {
  width: 458,
  height: 550,
  maximizable: false,
  resizable: false,
};

const CreatePhase = () => {
  const location = useLocation();
  const params = queryString.parse(location.search);

  const { t } = useTranslation();

  const [phase, setPhase] = useState({
    label: t(('phaseForms:phases.' + params.phase) as string),
    value: params.phase as string,
  });
  const [date, setDate] = useState(new Date(Date.parse(params.date as string)));

  const handleChange = (
    event,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    setter(value);
  };

  const handleSelectChange = (option) => {
    setPhase(option);
  };

  const handleCreatePhase = () => {
    phasePartCreate(
      params.url as string,
      params.token as string,
      params.jobGuid as string,
      phase.value,
      getDateString(date),
      (data) => {
        if (data.status === 200) {
          showMessageBox(
            'phaseForms:create.success',
            MSGBOX_TYPE_SUCCESS,
            MSGBOX_BUTTONS_OK,
            () => {
              closeCurrentElectronWindow();
            }
          );
        }
      }
    );
  };

  setCurrentElectronWindowTitle(t(title));

  return (
    <FormBackground>
      <TitleBar title={t(title)} icon={false} />
      <Row>
        <FormColumn>
          <FormCard>
            <FormRow title={t('jobForms:common.jobInfo')}>
              <FormInfo>
                <FormInfoRow>
                  <FormInfoHeader>
                    {t('jobForms:common.jobIdentification')}
                  </FormInfoHeader>
                  <FormInfoContent>{params.jobId}</FormInfoContent>
                </FormInfoRow>
                <FormInfoRow>
                  <FormInfoHeader>
                    {t('jobForms:common.location')}
                  </FormInfoHeader>
                  <FormInfoContent>{params.jobLocation}</FormInfoContent>
                </FormInfoRow>
                <FormInfoRow>
                  <FormInfoHeader>
                    {t('jobForms:common.description')}
                  </FormInfoHeader>
                  <FormInfoContent>{params.jobDescription}</FormInfoContent>
                </FormInfoRow>
              </FormInfo>
            </FormRow>
            <FormRow title={t('phaseForms:create.phase')}>
              <Select
                value={phase}
                onChange={handleSelectChange}
                options={[
                  { label: t('phaseForms:phases.saw'), value: 'saw' },
                  { label: t('phaseForms:phases.press'), value: 'press' },
                  {
                    label: t('phaseForms:phases.transport'),
                    value: 'transport',
                  },
                  { label: t('phaseForms:phases.assembly'), value: 'assembly' },
                ]}
              />
            </FormRow>

            <FormRow title={t('phaseForms:create.date')}>
              <DatePicker
                name='date'
                value={date}
                onChange={(e) => handleChange(e, setDate)}
                direction={'up'}
              />
            </FormRow>
          </FormCard>

          <FormCardButtons>
            <Cancel onClick={() => closeCurrentElectronWindow()}>
              {t('messageBox:buttons.cancel')}
            </Cancel>
            <Submit onClick={handleCreatePhase}>
              {t('phaseForms:create.create')}
            </Submit>
          </FormCardButtons>
        </FormColumn>
      </Row>
    </FormBackground>
  );
};

export {
  CreatePhase,
  CreatePhasePath,
  CreatePhasePathWithParams,
  CreatePhaseSettings,
};
