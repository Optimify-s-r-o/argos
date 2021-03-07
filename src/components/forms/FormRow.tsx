import React from 'react';
import styled from 'styled-components';
import { getColorWithOpacity } from '../../styles/theme';

interface FormRowProps {
  children?: any;
  title?: string;
  horizontal?: boolean;
  selectable?: boolean;
  border?: boolean;
}

const FormRow = (props: FormRowProps) => {
  let selectable = false;
  if (props.hasOwnProperty('selectable') && props.selectable === true)
    selectable = true;

  let showBorder = true;
  if (props.hasOwnProperty('border') && props.border === false)
    showBorder = false;

  return (
    <FormCardRow
      className={showBorder ? '' : 'no-border'}
      horizontal={props.horizontal}
    >
      <FormCardRowHeader>{props.title}</FormCardRowHeader>
      <FormCardRowContent>
        {selectable ? (
          <Selectable className='selectable'>{props.children}</Selectable>
        ) : (
          props.children
        )}
      </FormCardRowContent>
    </FormCardRow>
  );
};

export default FormRow;

export const FormCardRowHeader = styled.div`
  width: 360px;

  padding: 0.75rem 2.5rem 0.25rem;

  color: #004466;
  font-weight: 400;
`;

export const FormCardRowContent = styled.div`
  display: flex;

  width: 360px;

  color: #004466;
  font-weight: 400;

  > *:first-child {
    flex-grow: 1;
  }
`;

export const FormCardRow = styled.div<{ horizontal?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.horizontal ? 'row' : 'column')};

  &:last-child,
  &:last-of-type,
  &.no-border {
    ${FormCardRowHeader}, ${FormCardRowContent} {
      border: 0;
    }
  }

  ${(props) =>
    props.horizontal &&
    `
    ${FormCardRowHeader} {
      display: flex;
      align-items: center;

      width: auto;

      padding: 0 1rem 0 2.5rem;
    }

    ${FormCardRowContent} {
      width: auto;
    }
  `}
`;

const Selectable = styled.span`
  user-select: all;
`;

export const FormInfo = styled.table`
  margin: 0.5rem 1rem;
  padding: 0.25rem 1.5rem;

  background-color: ${(props) => props.theme.colors.white};
  border-radius: 19px;
  box-shadow: 0 5px 10px -5px ${(props) => getColorWithOpacity(props.theme.colors.primary, 25)};
`;

export const FormInfoRow = styled.tr``;

export const FormInfoHeader = styled.th`
  padding: 0.5rem 0;

  font-weight: 300;
  text-align: left;

  &:after {
    content: ':';
  }
`;

export const FormInfoContent = styled.td`
  padding: 0.5rem 0;

  user-select: all;
`;
