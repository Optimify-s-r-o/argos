import FormRow from '../forms/FormRow';
import React, { useState } from 'react';
import TitleBar from '../TitleBar';
import { FormCard, FormColumn } from '../../styles/forms';
import { Row } from '../../styles/global';
import { useTranslation } from 'react-i18next';
import '../../styles/main.css';
import '../../styles/forms.css';

const title = 'capacityForms:titleBar';

const CapacityChangePath = '/capacity-change';

const CapacityChangeSettings = {
  title: title,
};

const CapacityChange = () => {
  const [jobId] = useState('');
  const [phase] = useState('');
  const [requiredCapacity] = useState(0);
  const [freeCapacity, setFreeCapacity] = useState(0);
  const [days, setDays] = useState([
    {
      day: new Date(),
      value: 300,
    },
    {
      day: new Date(),
      value: 200,
    },
    {
      day: new Date(),
      value: 200,
    },
  ]); // TODO: remove example data
  const { t } = useTranslation();

  const handleDayChange = (event) => {
    const target = event.target;
    const index = target.name;

    let newDays = Object.assign({}, days);
    newDays[index].value = target.value;

    let newFreeCapacity = requiredCapacity;
    newDays.forEach((day) => {
      newFreeCapacity -= day.value;
    });

    setFreeCapacity(newFreeCapacity);
    setDays(newDays);
  };

  const handleAddJob = () => {
    // TODO
  };

  return (
    <>
      <TitleBar title={t(title) + ': ' + jobId + ', ' + phase} icon={false} />
      <Row>
        <FormColumn>
          <FormCard>
            <FormRow title={t('capacityForms:requiredCapacity')}>
              {requiredCapacity}
            </FormRow>

            <FormRow title={t('capacityForms:freeCapacity')}>
              <input
                name='customerId'
                type='text'
                value={freeCapacity}
                disabled={true}
              />
            </FormRow>

            {days.map((day, index) => {
              return (
                <FormRow
                  title={day.day.toISOString()}
                  border={index + 1 === days.length}
                >
                  <input
                    name={index.toString()}
                    type='number'
                    value={days[index].value}
                    onChange={handleDayChange}
                  />
                </FormRow>
              );
            })}

            <FormRow border={false}>
              <button className='btn btn-text' onClick={() => handleAddJob()}>
                {t('capacityForms:saveCapacities')}
              </button>
            </FormRow>
          </FormCard>
        </FormColumn>
      </Row>
    </>
  );
};

export { CapacityChange, CapacityChangePath, CapacityChangeSettings };
