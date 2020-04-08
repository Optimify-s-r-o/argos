const ACTION_SET_CALENDAR_DATA = 'SET_CALENDAR_DATA';
const ACTION_SWITCH_CALENDAR_VIEW = 'SWITCH_CALENDAR_VIEW';
const ACTION_SET_WEEKS = 'SET_WEEKS';
const ACTION_SORT_CALENDAR = 'SORT_CALENDAR';

function setCalendarData(data) {
  return {
    type: ACTION_SET_CALENDAR_DATA,
    data: data,
  };
}

function setCalendarView(view) {
  return {
    type: ACTION_SWITCH_CALENDAR_VIEW,
    view: view,
  };
}

function setWeeks(weeks) {
  return {
    type: ACTION_SET_WEEKS,
    weeks: weeks,
  };
}

function sort(order) {
  return {
    type: ACTION_SORT_CALENDAR,
    order: order,
  };
}

export {
  ACTION_SET_CALENDAR_DATA,
  ACTION_SWITCH_CALENDAR_VIEW,
  ACTION_SET_WEEKS,
  ACTION_SORT_CALENDAR,
  setCalendarData,
  setCalendarView,
  setWeeks,
  sort,
};
