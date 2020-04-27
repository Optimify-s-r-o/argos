import { CapacitiesViewType } from '../types/settings';

export const ACTION_SWITCH_CAPACITIES_VIEW = 'SWITCH_CAPACITIES_VIEW';

export const setCapacitiesView = (view: CapacitiesViewType) => {
  return {
    type: ACTION_SWITCH_CAPACITIES_VIEW,
    view: view,
  };
};
