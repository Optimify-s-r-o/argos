import { prepareDays } from '../utils/days';
import jobsGenerator from '../utils/jobsGenerator'; // TODO: remove all occurrences
import {ACTION_DAYS_SWITCH} from '../actions/days';
import {ACTION_SET_WEEKS, ACTION_SWITCH_CALENDAR_VIEW} from '../actions/calendar';
import {ACTION_SWITCH_CAPACITIES_VIEW} from '../actions/capacities';
import {ACTION_SWITCH_VIEW} from '../actions/view';
import {ACTION_SET_CURRENT_NAV} from '../actions/nav';
import {ACTION_APP_ACCOUNT_TOKEN_SET} from "../actions/app";

const initialDays = prepareDays(0);
const initialState = {
    token: null,
    settings: {
        currentNav: 'home',
        view: 'calendar',
        calendarView: 'classicDays',
        capacitiesView: 'percentage',
        weeks: 4,
    },
    weekDelta: 0,
    days: initialDays,
    events: {},
    capacities: {},
    jobs: jobsGenerator(initialDays),
};

function rootReducer(state = initialState, action) {
    if (action.type === ACTION_APP_ACCOUNT_TOKEN_SET) {
        return Object.assign({}, state, {
            token: action.token,
        });
    }

    else if (action.type === ACTION_SET_CURRENT_NAV) {
        return Object.assign({}, state, {
            settings: Object.assign({}, state.settings, {
                currentNav: action.nav,
            })
        });
    }

    else if (action.type === ACTION_SWITCH_VIEW) {
        return Object.assign({}, state, {
            settings: Object.assign({}, state.settings, {
                view: action.view,
            })
        });
    }

    else if (action.type === ACTION_SWITCH_CALENDAR_VIEW) {
        return Object.assign({}, state, {
            settings: Object.assign({}, state.settings, {
                calendarView: action.view,
            })
        });
    }

    else if (action.type === ACTION_SWITCH_CAPACITIES_VIEW) {
        return Object.assign({}, state, {
            settings: Object.assign({}, state.settings, {
                capacitiesView: action.view,
            })
        });
    }

    else if (action.type === ACTION_SET_WEEKS) {
        // TODO api call, request new days
        let newDays = prepareDays(state.weekDelta, action.weeks);
        return Object.assign({}, state, {
            settings: Object.assign({}, state.settings, {
                weeks: action.weeks,
            }),
            days: newDays,
            jobs: jobsGenerator(newDays), // TODO: remove after testing
        });
    }

    else if (action.type === ACTION_DAYS_SWITCH) {
        let newWeekDelta = null;
        if (action.switch === 'forward')
            newWeekDelta = state.weekDelta + 1;
        else if (action.switch === 'backward')
            newWeekDelta = state.weekDelta - 1;
        else if (action.switch === 'today')
            newWeekDelta = 0;

        // TODO api call, request only changed days
        let newDays = prepareDays(newWeekDelta, state.settings.weeks);
        return Object.assign({}, state, {
            weekDelta: newWeekDelta,
            days: newDays,
            jobs: jobsGenerator(newDays), // TODO: remove after testing
        });
    }

    else if (action.type === 'JOBS_CHANGED') {
        return Object.assign({}, state, {
            jobs: Object.assign({}, state.jobs, /*action.jobsToChange*/jobsGenerator(state.days))
        })
    }

    return state;
}

export default rootReducer;