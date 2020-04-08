import React from 'react';

function FormRow(props) {
  let selectable = false;
  if (props.hasOwnProperty('selectable') && props.selectable === true)
    selectable = true;

  let showBorder = true;
  if (props.hasOwnProperty('border') && props.border === false)
    showBorder = false;

  return (
    <div className={showBorder ? 'form-card-row' : 'form-card-row no-border'}>
      <div className='form-card-row-header'>{props.title}</div>
      <div className='form-card-row-content'>
        {selectable ? (
          <span className='selectable'>{props.children}</span>
        ) : (
          props.children
        )}
      </div>
    </div>
  );
}

export default FormRow;
