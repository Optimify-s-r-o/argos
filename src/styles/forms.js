import { Column } from './global';
import styled from 'styled-components';

export const FormColumn = styled(Column)`
  padding: 16px;
`;

export const FormCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;

export const FormCardHeader = styled.div`
  padding: 16px 24px;

  background: rgba(0, 68, 102, 0.05);
  border-top: 1px solid rgba(0, 68, 102, 0.2);
  font-weight: 500;
  text-transform: uppercase;

  &:first-child {
    border-top: 0;

    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
`;
