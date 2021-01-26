import getShifts from '../../../api/shifts/get-shifts';
import React, { useEffect, useState } from 'react';
import Shift from './03_Shifts/Shift';
import styled from 'styled-components';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { phaseTypesWithShifts } from '../../../enums/phases';
import { useTranslation } from 'react-i18next';

interface ShiftsProps {
  token: string;
  url: string;
}

const Shifts = (props: ShiftsProps) => {
  const { t } = useTranslation();
  const phases = phaseTypesWithShifts;

  const [phaseShifts, setPhaseShifts] = useState<object>({});

  useEffect(() => {
    if (props.url && props.token)
      phases.forEach((phase) =>
        getShifts(props.url as string, props.token as string, phase, (data) => {
          setPhaseShifts(
            Object.assign(phaseShifts, {
              [phase]: data.body,
            })
          );
        })
      );
    else alert('ERROR in Settings component!');
  }, []);

  useEffect(() => {
    console.log(phaseShifts);
  }, [phaseShifts]);

  return (
    <form>
      {phases.map((phase) => (
        <Phase>
          <PhaseHeader>{t('phaseForms:phases.' + phase)}</PhaseHeader>
          {phaseShifts.hasOwnProperty(phase) &&
            phaseShifts[phase].map((shift) => (
              <Shift
                initialShift={shift}
                token={props.token}
                url={props.url}
                phase={phase}
              />
            ))}
          <AddShiftButton
            onClick={() => {
              setPhaseShifts(
                Object.assign({}, phaseShifts, {
                  [phase]: [...phaseShifts[phase], null],
                })
              );
              console.log('asd');
            }}
          >
            <FontAwesomeIcon icon={faPlus} /> Přidat směnu
          </AddShiftButton>
        </Phase>
      ))}
    </form>
  );
};

export default Shifts;

const Phase = styled.div`
  margin-bottom: 16px;
`;

const PhaseHeader = styled.div`
  margin-bottom: 8px;

  font-size: 16px;
  font-weight: 400;
`;

const AddShiftButton = styled.div``;
