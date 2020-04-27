import React from 'react';
import styled from 'styled-components';
import { TextButton } from '../../../../../../styles/global';
import { useTranslation } from 'react-i18next';

const Legend = () => {
  const { t } = useTranslation();

  return (
    <LegendEl>
      <TextButton>{t('calendar:weekSelector.legend')}</TextButton>
    </LegendEl>
  );
};

export default Legend;

const LegendEl = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  padding: 0 32px;
`;
