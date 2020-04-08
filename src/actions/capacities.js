const ACTION_SWITCH_CAPACITIES_VIEW = 'SWITCH_CAPACITIES_VIEW';

function setCapacitiesView(view) {
  return {
    type: ACTION_SWITCH_CAPACITIES_VIEW,
    view: view,
  };
}

export { ACTION_SWITCH_CAPACITIES_VIEW, setCapacitiesView };
