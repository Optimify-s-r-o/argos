import DatePicker from '../forms/DatePicker';
import FormRow from '../forms/FormRow';
import React, { useState } from 'react';
import Select from '../forms/Select';
import TitleBar from '../TitleBar';
import { FormCard, FormColumn } from '../../styles/forms';
import { Row, TextButton } from '../../styles/global';
import { useTranslation } from 'react-i18next';
import '../../styles/main.css';
import '../../styles/forms.css';

const title = 'phaseForms:create.titleBar';

const CreatePhasePath = '/create-phase';

const CreatePhaseSettings = {
  title: title,
};

const CreatePhase = () => {
  const [phase, setPhase] = useState(null);
  const [date, setDate] = useState(new Date());
  const { t } = useTranslation();

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
    // TODO
  };

  return (
    <>
      <TitleBar title={t(title)} icon={false} />
      <Row>
        <FormColumn>
          <FormCard>
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
                  { label: t('phaseForms:phases.assembly'), value: 'Assembly' },
                ]}
              />
            </FormRow>

            <FormRow title={t('phaseForms:create.date')}>
              <DatePicker
                name='date'
                value={date}
                onChange={(e) => handleChange(e, setDate)}
              />
            </FormRow>

            <FormRow border={false}>
              <TextButton
                className='btn btn-text'
                onClick={() => handleCreatePhase()}
              >
                {t('phaseForms:create.create')}
              </TextButton>
            </FormRow>
          </FormCard>
        </FormColumn>
      </Row>
    </>
  );
};

export { CreatePhase, CreatePhasePath, CreatePhaseSettings };
