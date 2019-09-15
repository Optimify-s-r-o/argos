import React from 'react';
import '../../styles/main.css';
import '../../styles/forms.css';
import TitleBar from '../TitleBar';
import FormRow from '../FormRow';
import { withTranslation } from 'react-i18next';

const title = 'capacityForms:titleBar';

const DayCapacityEditPath = '/day-capacity-edit';

const DayCapacityEditSettings = {
    title: title
};

class DayCapacityEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            day: new Date(),
            phase: '',
            currentValue: 0,
            newValue: 0,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
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
            <TitleBar key="titleBar" title={t(title)} icon={false}/>,
            <div key="content" className="row">
                <div className="column">
                    <div className="form-card">
                        <FormRow title={t('capacityForms:date')}>
                            {this.state.date}
                        </FormRow>

                        <FormRow title={t('capacityForms:phase')}>
                            {this.state.phase}
                        </FormRow>

                        <FormRow title={t('capacityForms:currentValue')}>
                            {this.state.currentValue}
                        </FormRow>

                        <FormRow title={t('capacityForms:newValue')}>
                            <input
                                type="text"
                                name="newValue"
                                value={this.state.newValue}
                                onChange={this.handleChange}
                            />
                        </FormRow>

                        <FormRow border={false}>
                            <button className="btn btn-text" onClick={() => this.handleAddJob()}>{t('capacityForms:saveCapacity')}</button>
                        </FormRow>
                    </div>
                </div>
            </div>
        ];
    }
}

DayCapacityEdit = withTranslation()(DayCapacityEdit);

export {DayCapacityEdit, DayCapacityEditPath, DayCapacityEditSettings};
