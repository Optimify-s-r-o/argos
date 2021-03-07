import Cancel from '../forms/Cancel';
import getJob from '../../api/proxy/get-job';
import getJobList from '../../api/proxy/job-list';
import Input from '../forms/Input';
import jobAutoplan from '../../api/jobs/autoplan';
import jobCreate from '../../api/jobs/import';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import Select from '../forms/Select';
import styled from 'styled-components';
import Submit from '../forms/Submit';
import Switch from '../forms/Switch';
import TitleBar from '../TitleBar';
import { callReloadPlates } from '../../utils/helper-functions';
import { DatePicker, DateRangePicker } from '../forms/Calendar';
import { EVENT_JOB_CREATED } from '../../events/jobs';
import { getDateString } from '../../utils/days';
import { LoadedJobType } from '../../types/job';
import { Row } from '../../styles/global';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import '../../styles/main.css';
import '../../styles/forms.css';
import FormRow, {
  FormInfo,
  FormInfoContent,
  FormInfoHeader,
  FormInfoRow,
} from '../forms/FormRow';
import {
  FormBackground,
  FormCard,
  FormCardButtons,
  FormColumn,
} from '../../styles/forms';
import {
  getIpcRenderer,
  closeCurrentElectronWindow,
  setCurrentElectronWindowTitle,
} from '../../utils/electron';
import {
  MSGBOX_BUTTONS_OK,
  MSGBOX_TYPE_ERROR,
  MSGBOX_TYPE_SUCCESS,
  showMessageBox,
} from '../../utils/showMessageBox';

const ipcRenderer = getIpcRenderer();

const JobAddPath = '/job-add';

const JobAddSettings = {
  width: 457,
  height: 706,
  maximizable: false,
  resizable: false,
};

const JobAdd = () => {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState('');
  const [contractDates, setContractDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [deadline, setDeadline] = useState(new Date());
  const [acceptedByCustomer, setAcceptedByCustomer] = useState(false);
  const [loadedJob, setLoadedJob] = useState<LoadedJobType | null>(null);
  const [jobList, setJobList] = useState({});
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const params = queryString.parse(location.search);

    setToken(params.token as string);
    setUrl(params.url as string);

    getJobList((res) => {
      let jobList: Array<{ label: string; value: string }> = [];
      res.body.jobs.forEach((jobIdentification: string) => {
        jobList.push({
          label: jobIdentification,
          value: jobIdentification,
        });
      });
      setJobList(jobList);
    });
  }, [location]);

  const handleInputChange = (event, setter) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    setter(value);
  };

  const handleJobSelected = (event) => {
    // TODO: add loader
    getJob(event.value, (res) => {
      setLoadedJob(res.body);
      // TODO: remove loader
    });
  };

  const handleAddJob = () => {
    if (token && url && loadedJob) {
      // edit loadedJob
      loadedJob.customer = customerId;
      loadedJob.contractStart = getDateString(contractDates.startDate);
      loadedJob.contractEnd = getDateString(contractDates.endDate);
      loadedJob.deadline = getDateString(deadline);

      // TODO: validate inputs
      jobCreate(url, token, loadedJob, (resJob) => {
        // TODO: review error codes
        if (resJob.status === 200) {
          jobAutoplan(
            url,
            token,
            resJob.body.id,
            getDateString(deadline),
            (resPlan) => {
              if (resPlan.status === 200) {
                ipcRenderer.send('event', EVENT_JOB_CREATED, resJob.body);

                showMessageBox(
                  'jobForms:added',
                  MSGBOX_TYPE_SUCCESS,
                  MSGBOX_BUTTONS_OK,
                  () => {
                    closeCurrentElectronWindow();
                  }
                );
              } else {
                showMessageBox(
                  'Uncatched error!',
                  MSGBOX_TYPE_ERROR,
                  MSGBOX_BUTTONS_OK
                );
              }
            }
          );
        } else if (
          resJob.status === 422 &&
          resJob.body.errorCode === 'PlateNameNotExists'
        ) {
          callReloadPlates(url, token, () => {
            handleAddJob();
          });
        } else {
          showMessageBox(
            'Uncatched error!',
            MSGBOX_TYPE_ERROR,
            MSGBOX_BUTTONS_OK
          );
        }
      });
    } else {
      console.error('Not logged in!');
      alert('ERROR in JobAdd component!');
      // TODO: not logged in
    }
  };

  setCurrentElectronWindowTitle(t('jobForms:add.title'));

  return (
    <FormBackground>
      <TitleBar title={t('jobForms:add.title')} icon={false} />
      <Row>
        <FormColumn>
          <JobAddFormCard isJobLoaded={loadedJob !== null}>
            <FormRow title={t('jobForms:common.jobIdentification')}>
              <Select
                options={jobList}
                placeholder={t('jobForms:common.selectJobId')}
                onChange={handleJobSelected}
                tabIndex={1}
                autoFocus
              />
            </FormRow>

            <JobLoadedItems isJobLoaded={loadedJob !== null}>
              <FormRow title={t('jobForms:common.jobInfo')}>
                <FormInfo>
                  <FormInfoRow>
                    <FormInfoHeader>
                      {t('jobForms:common.location')}
                    </FormInfoHeader>
                    <FormInfoContent>
                      {loadedJob ? loadedJob.address : ''}
                    </FormInfoContent>
                  </FormInfoRow>
                  <FormInfoRow>
                    <FormInfoHeader>
                      {t('jobForms:common.description')}
                    </FormInfoHeader>
                    <FormInfoContent>
                      {loadedJob ? loadedJob.type : ''}
                    </FormInfoContent>
                  </FormInfoRow>
                </FormInfo>
              </FormRow>

              {/*
              <FormRow title='Sněhová oblast' selectable={true}></FormRow>
              <FormRow title='Zatížení' selectable={true}></FormRow>
              <FormRow
                title={t('jobForms:common.trussTypes')}
                selectable={true}
              ></FormRow>
              */}

              <FormRow title={t('jobForms:common.customerIdentification')}>
                <Input
                  name='customerId'
                  type='text'
                  value={customerId}
                  onChange={(e) => handleInputChange(e, setCustomerId)}
                  tabIndex={loadedJob ? 2 : -1}
                  disabled={loadedJob === null}
                />
              </FormRow>

              <FormRow title={t('jobForms:common.contractDates')}>
                <DateRangePicker
                  name='contractDates'
                  value={contractDates}
                  onChange={(e) => handleInputChange(e, setContractDates)}
                  tabIndex={loadedJob ? 3 : -1}
                  direction={'up'}
                />
              </FormRow>

              <FormRow title={t('jobForms:common.deadline')}>
                <DatePicker
                  name='deadline'
                  value={deadline}
                  onChange={(e) => handleInputChange(e, setDeadline)}
                  tabIndex={loadedJob ? 4 : -1}
                  direction={'up'}
                />
              </FormRow>

              <FormRow
                title={t('jobForms:common.isAcceptedByCustomer')}
                horizontal
              >
                <Switch
                  name='acceptedByCustomer'
                  checked={acceptedByCustomer}
                  onChange={(e) => handleInputChange(e, setAcceptedByCustomer)}
                  tabIndex={loadedJob ? 5 : -1}
                />
              </FormRow>
            </JobLoadedItems>
          </JobAddFormCard>
          <FormCardButtons>
            <Cancel
              onClick={() => closeCurrentElectronWindow()}
              tabIndex={loadedJob ? 6 : 2}
            >
              {t('messageBox:buttons.cancel')}
            </Cancel>
            <Submit
              onClick={handleAddJob}
              disabled={loadedJob === null}
              hideDisabled
              tabIndex={loadedJob ? 7 : -1}
            >
              {t('jobForms:add.addJob')}
            </Submit>
          </FormCardButtons>
        </FormColumn>
      </Row>
    </FormBackground>
  );
};

export { JobAdd, JobAddPath, JobAddSettings };

const JobAddFormCard = styled(FormCard)<{ isJobLoaded: boolean }>`
  height: ${(props) => (props.isJobLoaded ? 541 : 117)}px;

  transition: height 0.4s ease-in-out;
`;

const JobLoadedItems = styled.div<{ isJobLoaded: boolean }>`
  opacity: ${(props) => (props.isJobLoaded ? 1 : 0)};

  transition: opacity 0.4s ease-in-out 0.4s;
`;
