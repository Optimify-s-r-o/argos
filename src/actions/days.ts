export const ACTION_DAYS_SWITCH = 'DAYS_SWITCH';

export const switchForward = () => {
  return {
    type: ACTION_DAYS_SWITCH,
    switch: 'forward',
  };
};

export const switchBackward = () => {
  return {
    type: ACTION_DAYS_SWITCH,
    switch: 'backward',
  };
};

export const switchToday = () => {
  return {
    type: ACTION_DAYS_SWITCH,
    switch: 'today',
  };
};
