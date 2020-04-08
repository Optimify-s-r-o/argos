import React from 'react';
import '../../styles/main.css';
import '../../styles/forms.css';
import TitleBar from '../TitleBar';
import FormRow from '../FormRow';
import Select from '../forms/Select';
import DatePicker from '../forms/DatePicker';
import { withTranslation } from 'react-i18next';

const title = 'phaseForms:create.titleBar';

const CreatePhasePath = '/create-phase';

const CreatePhaseSettings = {
  title: title,
};

class CreatePhase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      phase: null,
      date: new Date(),
      isCalendarDateOpen: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSelectChange(option) {
    this.setState({ phase: option });
  }

  handleCreatePhase() {
    // TODO
  }

  render() {
    const { t } = this.props;
    return [
      <TitleBar key='titleBar' title={t(title)} icon={false} />,
      <div key='content' className='row'>
        <div className='column'>
          <div className='form-card'>
            <FormRow title={t('phaseForms:create.phase')}>
              <Select
                value={this.state.phase}
                onChange={this.handleSelectChange}
                options={[
                  { label: t('phaseForms:phases.saw'), value: 'saw' },
                  { label: t('phaseForms:phases.press'), value: 'press' },
                  {
                    label: t('phaseForms:phases.transport'),
                    value: 'transport',
                  },
                  { label: t('phaseForms:phases.assembly'), value: 'Assembly' },
                ]}
              />
            </FormRow>

            <FormRow title={t('phaseForms:create.date')}>
              <DatePicker
                name='date'
                value={this.state.date}
                onChange={this.handleChange}
              />
            </FormRow>

            <FormRow border={false}>
              <button
                className='btn btn-text'
                onClick={() => this.handleCreatePhase()}
              >
                {t('phaseForms:create.create')}
              </button>
            </FormRow>
          </div>
        </div>
      </div>,
    ];
  }
}

CreatePhase = withTranslation()(CreatePhase);

export { CreatePhase, CreatePhasePath, CreatePhaseSettings };
