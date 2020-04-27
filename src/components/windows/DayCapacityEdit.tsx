import FormRow from '../forms/FormRow';
import queryString from 'query-string';
import React, { useState } from 'react';
import TitleBar from '../TitleBar';
import { FormCard, FormColumn } from '../../styles/forms';
import { Row } from '../../styles/global';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import '../../styles/main.css';
import '../../styles/forms.css';

const title = 'capacityForms:titleBar';

const DayCapacityEditPath = '/day-capacity-edit';

const DayCapacityEditSettings = {
  title: title,
};

const DayCapacityEdit = () => {
  const location = useLocation();
  const params = queryString.parse(location.search);

  const [day] = useState(params.day as string);
  const [phase] = useState(params.phase as string);
  const [currentValue] = useState(parseInt(params.currentValue as string));
  const [newValue, setNewValue] = useState(
    parseInt(params.currentValue as string)
  );
  const { t } = useTranslation();

  const handleChange = (
    event,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    setter(value);
  };

  const saveCapacity = () => {};

  return (
    <>
      <TitleBar title={t(title)} icon={false} />
      <Row>
        <FormColumn>
          <FormCard>
            <FormRow title={t('capacityForms:date')}>{day}</FormRow>

            <FormRow title={t('capacityForms:phase')}>{phase}</FormRow>

            <FormRow title={t('capacityForms:currentValue')}>
              {currentValue}
            </FormRow>

            <FormRow title={t('capacityForms:newValue')}>
              <input
                type='number'
                name='newValue'
                value={newValue?.toString()}
                onChange={(e) => handleChange(e, setNewValue)}
              />
            </FormRow>

            <FormRow border={false}>
              <button className='btn btn-text' onClick={() => saveCapacity()}>
                {t('capacityForms:saveCapacity')}
              </button>
            </FormRow>
          </FormCard>
        </FormColumn>
      </Row>
    </>
  );
};

export { DayCapacityEdit, DayCapacityEditPath, DayCapacityEditSettings };
