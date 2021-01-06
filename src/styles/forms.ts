import styled from 'styled-components';
import { Column } from './global';

export const FormBackground = styled.div`
  height: 100%;

  background: ${(props) => props.theme.colors.primary};
`;

export const FormColumn = styled(Column)`
  padding: 32px;
`;

export const FormCard = styled.div`
  padding: 8px 16px;

  background-color: ${(props) => props.theme.colors.background};
  box-shadow: 0 0 48px -8px rgba(0, 0, 0, 0.75);
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

export const FormCardButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  padding: 16px 0 0;
`;
