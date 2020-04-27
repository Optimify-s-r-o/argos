import { ViewType } from '../types/settings';

export const ACTION_SWITCH_VIEW = 'SWITCH_VIEW';

export const setView = (view: ViewType) => {
  return {
    type: ACTION_SWITCH_VIEW,
    view: view,
  };
};
