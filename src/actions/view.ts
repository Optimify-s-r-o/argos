export const ACTION_SWITCH_VIEW = 'SWITCH_VIEW';

export const setView = (view: string) => {
  return {
    type: ACTION_SWITCH_VIEW,
    view: view,
  };
};
