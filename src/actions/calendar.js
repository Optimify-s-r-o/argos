const ACTION_SET_CALENDAR_DATA = 'SET_CALENDAR_DATA';
const ACTION_SWITCH_CALENDAR_VIEW = 'SWITCH_CALENDAR_VIEW';
const ACTION_SET_WEEKS = 'SET_WEEKS';

function setCalendarData(data) {
    return {
        type: ACTION_SET_CALENDAR_DATA,
        data: data,
    }
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
    }
}

export {ACTION_SET_CALENDAR_DATA, ACTION_SWITCH_CALENDAR_VIEW, ACTION_SET_WEEKS, setCalendarData, setCalendarView, setWeeks};