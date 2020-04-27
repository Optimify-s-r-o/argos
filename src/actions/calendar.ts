import { CalendarDataType } from '../types/calendar';
import { CalendarViewType, SortType } from '../types/settings';

export const ACTION_SET_CALENDAR_DATA = 'SET_CALENDAR_DATA';
export const ACTION_SWITCH_CALENDAR_VIEW = 'SWITCH_CALENDAR_VIEW';
export const ACTION_SET_WEEKS = 'SET_WEEKS';
export const ACTION_SORT_CALENDAR = 'SORT_CALENDAR';

export const setCalendarData = (data: CalendarDataType) => {
  return {
    type: ACTION_SET_CALENDAR_DATA,
    data: data,
  };
};

export const setCalendarView = (view: CalendarViewType) => {
  return {
    type: ACTION_SWITCH_CALENDAR_VIEW,
    view: view,
  };
};

export const setWeeks = (weeks: number) => {
  return {
    type: ACTION_SET_WEEKS,
    weeks: weeks,
  };
};

export const sort = (order: SortType) => {
  return {
    type: ACTION_SORT_CALENDAR,
    order: order,
  };
};
