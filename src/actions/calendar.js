const ACTION_SWITCH_CALENDAR_VIEW = 'SWITCH_CALENDAR_VIEW';
const ACTION_SET_WEEKS = 'SET_WEEKS';

function setCalendarView(view) {
    return {
        type: ACTION_SWITCH_CALENDAR_VIEW,
        view: view
    };
}

function setWeeks(weeks) {
    return {
        type: ACTION_SET_WEEKS,
        weeks: weeks
    }
}

export {ACTION_SWITCH_CALENDAR_VIEW, ACTION_SET_WEEKS, setCalendarView, setWeeks};