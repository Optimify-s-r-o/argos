import React from 'react';
import '../../styles/main.css';
import '../../styles/forms.css';
import TitleBar from '../TitleBar';
import FormRow from '../FormRow';
import { withTranslation } from 'react-i18next';

const title = 'capacityForms:titleBar';

const CapacityChangePath = '/capacity-change';

const CapacityChangeSettings = {
    title: title
};

class CapacityChange extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            jobId: '',
            phase: '',
            requiredCapacity: 0,
            freeCapacity: 0,
            days: [
                {
                    day: new Date(),
                    value: 300
                },
                {
                    day: new Date(),
                    value: 200
                },
                {
                    day: new Date(),
                    value: 200
                }
            ] // TODO: remove example data
        };

        this.handleDayChange = this.handleDayChange.bind(this);
    }

    handleDayChange(event) {
        const target = event.target;
        const index = target.name;

        let newDays = this.state.days;
        newDays[index].value = target.value;

        let newFreeCapacity = this.state.requiredCapacity;
        newDays.forEach(day => {newFreeCapacity -= day.value;});

        this.setState({
            freeCapacity: newFreeCapacity,
            days: newDays
        });
    }

    render() {
        const { t } = this.props;
        return [
            <TitleBar key="titleBar" title={t(title) + ': ' + this.state.jobId + ', ' + this.state.phase} icon={false}/>,
            <div key="content" className="row">
                <div className="column">
                    <div className="form-card">
                        <FormRow title={t('capacityForms:requiredCapacity')}>
                            {this.state.requiredCapacity}
                        </FormRow>

                        <FormRow title={t('capacityForms:freeCapacity')}>
                            <input
                                name="customerId"
                                type="text"
                                value={this.state.freeCapacity}
                                disabled={true}
                            />
                        </FormRow>

                        {
                            this.state.days.map((day, index) => {
                                return <FormRow title={day.day.toISOString()} border={index + 1 === this.state.days.length}>
                                    <input
                                        name={index}
                                        type="number"
                                        value={this.state.days[index].value}
                                        onChange={this.handleDayChange}
                                    />
                                </FormRow>
                            })
                        }

                        <FormRow border={false}>
                            <button className="btn btn-text" onClick={() => this.handleAddJob()}>{t('capacityForms:saveCapacities')}</button>
                        </FormRow>
                    </div>
                </div>
            </div>
        ];
    }

    handleAddJob() {
        // TODO
    }
}

CapacityChange = withTranslation()(CapacityChange);

export {CapacityChange, CapacityChangePath, CapacityChangeSettings};
