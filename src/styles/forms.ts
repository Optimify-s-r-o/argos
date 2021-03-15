import styled from 'styled-components';
import { Column } from './global';

export const FormBackground = styled.div`
  height: 100%;

  background: ${(props) => props.theme.colors.primary};
`;

export const FormColumn = styled(Column)`
  padding: 32px;

  & + & {
    padding-left: 0;
  }
`;

export const FormCard = styled.div`
  padding: 8px 16px;

  background-color: ${(props) => props.theme.colors.background};
  box-shadow: 0 0 48px -8px rgba(0, 0, 0, 0.75);

  & + & {
    margin-top: 32px;
  }
`;

export const FormCardHeader = styled.div`
  margin: -8px -16px 0;
  padding: 16px 24px;

  background: rgba(0, 68, 102, 0.1);
  font-weight: 500;
  text-transform: uppercase;
`;

export const FormCardButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  padding: 16px 0 0;
`;
