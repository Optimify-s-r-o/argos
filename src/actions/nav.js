const ACTION_SET_CURRENT_NAV = 'SET_CURRENT_NAV';

function setCurrentNav(nav) {
  return {
    type: ACTION_SET_CURRENT_NAV,
    nav: nav,
  };
}

export { ACTION_SET_CURRENT_NAV, setCurrentNav };
