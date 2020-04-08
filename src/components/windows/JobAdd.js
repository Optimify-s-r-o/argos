import React from 'react';
import '../../styles/main.css';
import '../../styles/forms.css';
import TitleBar from '../TitleBar';
import FormRow from '../FormRow';
import Switch from '../forms/Switch';
import Select from '../forms/Select';
import DatePicker from '../forms/DatePicker';
import DateRangePicker from '../forms/DateRangePicker';
import { withTranslation } from 'react-i18next';
import jobCreate from '../../api/job-create';
import getJobList from '../../api/proxy/job-list';
import {
  getIpcRenderer,
  isElectron,
  closeCurrentElectronWindow,
  setCurrentElectronWindowTitle,
} from '../../utils/electron';
import { EVENT_JOB_CREATED } from '../../events/jobs';
import queryString from 'query-string';
import getJob from '../../api/proxy/get-job';
import {
  MSGBOX_BUTTONS_OK,
  MSGBOX_TYPE_ERROR,
  MSGBOX_TYPE_INFO,
  showMessageBox,
} from '../../utils/showMessageBox';
import { FormCard, FormCardHeader, FormColumn } from '../../styles/forms';
import { Row } from '../../styles/global';

const ipcRenderer = getIpcRenderer();

const JobAddPath = '/job-add';

const JobAddSettings = {
  width: 503,
  height: 754,
  maximizable: false,
  resizable: false,
};

class JobAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      jobId: '',
      customerId: '',
      contractDates: [new Date(), new Date()],
      deadline: new Date(),
      acceptedByCustomer: false,
      loadedJob: null,
      jobList: {},
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleJobSelected = this.handleJobSelected.bind(this);
    this.handleAddJob = this.handleAddJob.bind(this);
  }

  componentDidMount() {
    const params = queryString.parse(this.props.location.search);

    getJobList((res) => {
      let jobList = [];
      res.body.forEach((jobIdentification) => {
        jobList.push({
          label: jobIdentification,
          value: jobIdentification,
        });
      });
      this.setState({ jobList: jobList });
    });

    this.setState({
      token: params.token,
      url: params.url,
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleJobSelected(event) {
    getJob(event.value, (res) => {
      this.setState({ loadedJob: res.body });
    });
  }

  handleAddJob() {
    if (this.state.token) {
      // TODO: validate inputs
      // TODO: fetch job from proxy
      jobCreate(
        this.state.url,
        this.state.token,
        this.state.deadline,
        this.state.contractDates[0],
        this.state.contractDates[1],
        this.state.customerId,
        this.state.acceptedByCustomer,
        this.state.loadedJob,
        (res) => {
          if (isElectron() && res.status === 200) {
            ipcRenderer.send('event', EVENT_JOB_CREATED, res.data);

            showMessageBox(
              'jobForms:added',
              MSGBOX_TYPE_INFO,
              MSGBOX_BUTTONS_OK,
              (button) => {
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
      // TODO: not logged in
    }
  }

  render() {
    const { t } = this.props;
    setCurrentElectronWindowTitle(t('jobForms:add.title'));
    return [
      <TitleBar key='titleBar' title={t('jobForms:add.title')} icon={false} />,
      <Row key='content'>
        <FormColumn>
          <FormCard>
            <FormCardHeader>{t('jobForms:common.commonInfo')}</FormCardHeader>

            <FormRow title={t('jobForms:common.jobIdentification')}>
              <Select
                options={this.state.jobList}
                placeholder={t('jobForms:common.selectJobId')}
                onChange={this.handleJobSelected}
                tabIndex={1}
                autoFocus
              />
            </FormRow>

            <FormRow title={t('jobForms:common.customerIdentification')}>
              <input
                name='customerId'
                type='text'
                value={this.state.customerId}
                onChange={this.handleInputChange}
                tabIndex={2}
              />
            </FormRow>

            <FormRow title={t('jobForms:common.contractDates')}>
              <DateRangePicker
                name='contractDates'
                value={this.state.contractDates}
                onChange={this.handleInputChange}
              />
            </FormRow>

            <FormRow title={t('jobForms:common.deadline')}>
              <DatePicker
                name='deadline'
                value={this.state.deadline}
                onChange={this.handleInputChange}
              />
            </FormRow>

            <FormRow title={t('jobForms:common.isAcceptedByCustomer')}>
              <Switch
                name='acceptedByCustomer'
                checked={this.state.acceptedByCustomer}
                onChange={this.handleInputChange}
              />
            </FormRow>

            <FormRow border={false}>
              <button
                className='btn btn-text'
                onClick={this.handleAddJob}
                disabled={this.state.loadedJob === null}
              >
                {t('jobForms:add.addJob')}
              </button>
            </FormRow>

            <div className='form-card-header'>
              {t('jobForms:common.detailedInfo')}
            </div>
            <FormRow title={t('jobForms:common.location')} selectable={true}>
              {this.state.loadedJob ? this.state.loadedJob.Place : ''}
            </FormRow>
            <FormRow title={t('jobForms:common.description')} selectable={true}>
              {this.state.loadedJob ? this.state.loadedJob.Type : ''}
            </FormRow>
            <FormRow title='Sněhová oblast' selectable={true}></FormRow>
            <FormRow title='Zatížení' selectable={true}></FormRow>
            <FormRow
              title={t('jobForms:common.trussTypes')}
              selectable={true}
            ></FormRow>
          </FormCard>
        </FormColumn>
      </Row>,
    ];
  }
}

JobAdd = withTranslation()(JobAdd);

export { JobAdd, JobAddPath, JobAddSettings };
