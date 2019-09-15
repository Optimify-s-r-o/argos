import React from 'react';
import '../../styles/main.css';
import '../../styles/forms.css';
import TitleBar from '../TitleBar';
import FormRow from '../FormRow';
import Switch from '../forms/Switch';
import Select from '../forms/Select';
import DatePicker from '../forms/DatePicker';
import DateRangePicker from '../forms/DateRangePicker'
import { withTranslation } from 'react-i18next';

const title = 'Přidat zakázku';

const JobAddPath = '/job-add';

const JobAddSettings = {
    title: title
};

class JobAdd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            jobId: '',
            customerId: '',
            contractDates: [new Date(), new Date()],
            deadline: new Date(),
            acceptedByCustomer: false,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        const { t } = this.props;
        return [
            <TitleBar key="titleBar" title={title} icon={false}/>,
            <div key="content" className="row">
                <div className="column">
                    <div className="form-card">
                        <div className="form-card-header">
                            {t('jobForms:common.commonInfo')}
                        </div>

                        <FormRow title={t('jobForms:common.jobIdentification')}>
                            <Select
                                options={[
                                    {label: 'test1', value: 'test1'},
                                    {label: 'test2', value: 'test2'}
                                ]}
                            />
                        </FormRow>

                        <FormRow title={t('jobForms:common.customerIdentification')}>
                            <input
                                name="customerId"
                                type="text"
                                value={this.state.customerId}
                                onChange={this.handleInputChange}
                            />
                        </FormRow>

                        <FormRow title={t('jobForms:common.contractDates')}>
                            <DateRangePicker name="contractDates" value={this.state.contractDates} onChange={this.handleInputChange}/>
                        </FormRow>

                        <FormRow title={t('jobForms:common.deadline')}>
                            <DatePicker name="deadline" value={this.state.deadline} onChange={this.handleInputChange}/>
                        </FormRow>

                        <FormRow title={t('jobForms:common.isAcceptedByCustomer')}>
                            <Switch
                                name="acceptedByCustomer"
                                checked={this.state.acceptedByCustomer}
                                onChange={this.handleInputChange}
                            />
                        </FormRow>

                        <FormRow border={false}>
                            <button className="btn btn-text" onClick={() => this.handleAddJob()}>{t('jobForms:add.addJob')}</button>
                        </FormRow>


                        <div className="form-card-header">
                            {t('jobForms:common.detailedInfo')}
                        </div>
                        <FormRow title={t('jobForms:common.location')} selectable={true}></FormRow>
                        <FormRow title={t('jobForms:common.description')} selectable={true}></FormRow>
                        <FormRow title="Sněhová oblast" selectable={true}></FormRow>
                        <FormRow title="Zatížení" selectable={true}></FormRow>
                        <FormRow title={t('jobForms:common.trussTypes')} selectable={true}></FormRow>
                    </div>
                </div>
            </div>
        ];
    }

    handleAddJob() {
        // TODO
    }
}

JobAdd = withTranslation()(JobAdd);

export {JobAdd, JobAddPath, JobAddSettings};
