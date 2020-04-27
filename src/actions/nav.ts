import { NavType } from '../types/settings';

export const ACTION_SET_CURRENT_NAV = 'SET_CURRENT_NAV';

export const setCurrentNav = (nav: NavType) => {
  return {
    type: ACTION_SET_CURRENT_NAV,
    nav: nav,
  };
};
