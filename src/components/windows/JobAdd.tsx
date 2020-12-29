import DatePicker from '../forms/DatePicker';
import DateRangePicker from '../forms/DateRangePicker';
import FormRow from '../forms/FormRow';
import getJob from '../../api/proxy/get-job';
import getJobList from '../../api/proxy/job-list';
import jobCreate from '../../api/job-create';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import Select from '../forms/Select';
import Switch from '../forms/Switch';
import TitleBar from '../TitleBar';
import { EVENT_JOB_CREATED } from '../../events/jobs';
import { FormCard, FormCardHeader, FormColumn } from '../../styles/forms';
import { LoadedJobType } from '../../types/job';
import { Row } from '../../styles/global';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import '../../styles/main.css';
import '../../styles/forms.css';
import {
  getIpcRenderer,
  isElectron,
  closeCurrentElectronWindow,
  setCurrentElectronWindowTitle,
} from '../../utils/electron';
import {
  MSGBOX_BUTTONS_OK,
  MSGBOX_TYPE_ERROR,
  MSGBOX_TYPE_INFO,
  showMessageBox,
} from '../../utils/showMessageBox';

const ipcRenderer = getIpcRenderer();

const JobAddPath = '/job-add';

const JobAddSettings = {
  width: 503,
  height: 754,
  maximizable: false,
  resizable: false,
};

const JobAdd = () => {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState('');
  const [contractDates, setContractDates] = useState([new Date(), new Date()]);
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
      console.log(res);
      setLoadedJob(res.body);
      // TODO: remove loader
    });
  };

  const handleAddJob = () => {
    if (token && url && loadedJob) {
      // TODO: validate inputs
      jobCreate(
        url,
        token,
        deadline,
        contractDates[0],
        contractDates[1],
        customerId,
        acceptedByCustomer,
        loadedJob,
        (res) => {
          if (isElectron() && res.status === 200) {
            ipcRenderer.send('event', EVENT_JOB_CREATED, res.body);

            showMessageBox(
              'jobForms:added',
              MSGBOX_TYPE_INFO,
              MSGBOX_BUTTONS_OK,
              () => {
                closeCurrentElectronWindow();
              }
            );
          } else if (res.status === 422) {
            showMessageBox(
              'jobForms:duplicateJob',
              MSGBOX_TYPE_ERROR,
              MSGBOX_BUTTONS_OK
            );
          }
        }
      );
    } else {
      console.error('Not logged in!');
      alert('ERROR in JobAdd component!');
      // TODO: not logged in
    }
  };

  setCurrentElectronWindowTitle(t('jobForms:add.title'));

  return (
    <>
      <TitleBar title={t('jobForms:add.title')} icon={false} />
      <Row>
        <FormColumn>
          <FormCard>
            <FormCardHeader>{t('jobForms:common.commonInfo')}</FormCardHeader>

            <FormRow title={t('jobForms:common.jobIdentification')}>
              <Select
                options={jobList}
                placeholder={t('jobForms:common.selectJobId')}
                onChange={handleJobSelected}
                tabIndex={1}
                autoFocus
              />
            </FormRow>

            <FormRow title={t('jobForms:common.customerIdentification')}>
              <input
                name='customerId'
                type='text'
                value={customerId}
                onChange={(e) => handleInputChange(e, setCustomerId)}
                tabIndex={2}
              />
            </FormRow>

            <FormRow title={t('jobForms:common.contractDates')}>
              <DateRangePicker
                name='contractDates'
                value={contractDates}
                onChange={(e) => handleInputChange(e, setContractDates)}
              />
            </FormRow>

            <FormRow title={t('jobForms:common.deadline')}>
              <DatePicker
                name='deadline'
                value={deadline}
                onChange={(e) => handleInputChange(e, setDeadline)}
              />
            </FormRow>

            <FormRow title={t('jobForms:common.isAcceptedByCustomer')}>
              <Switch
                name='acceptedByCustomer'
                checked={acceptedByCustomer}
                onChange={(e) => handleInputChange(e, setAcceptedByCustomer)}
              />
            </FormRow>

            <FormRow border={false}>
              <button
                className='btn btn-text'
                onClick={handleAddJob}
                disabled={loadedJob === null}
              >
                {t('jobForms:add.addJob')}
              </button>
            </FormRow>

            <div className='form-card-header'>
              {t('jobForms:common.detailedInfo')}
            </div>
            <FormRow title={t('jobForms:common.location')} selectable={true}>
              {loadedJob ? loadedJob.address : ''}
            </FormRow>
            <FormRow title={t('jobForms:common.description')} selectable={true}>
              {loadedJob ? loadedJob.type : ''}
            </FormRow>
            <FormRow title='Sněhová oblast' selectable={true}></FormRow>
            <FormRow title='Zatížení' selectable={true}></FormRow>
            <FormRow
              title={t('jobForms:common.trussTypes')}
              selectable={true}
            ></FormRow>
          </FormCard>
        </FormColumn>
      </Row>
    </>
  );
};

export { JobAdd, JobAddPath, JobAddSettings };
