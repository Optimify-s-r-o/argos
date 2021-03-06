import setDatabasePath from '../api/proxy/set-database-path';
import { ACTION_DAYS_SWITCH } from '../actions/days';
import { ACTION_SET_CURRENT_NAV } from '../actions/nav';
import { ACTION_SWITCH_CAPACITIES_VIEW } from '../actions/capacities';
import { ACTION_SWITCH_VIEW } from '../actions/view';
import { getIpcRenderer, isElectron } from '../utils/electron';
import { prepareDays } from '../utils/days';
import { SettingsType } from '../types/settings';
import { StateType } from '../types/state';
import {
	ACTION_APP_ACCOUNT_TOKEN_SET,
	ACTION_SET_PAMBA_PATH,
} from "../actions/app";
import {
	ACTION_SET_CALENDAR_DATA,
	ACTION_SET_WEEKS,
	ACTION_SORT_CALENDAR,
	ACTION_SWITCH_CALENDAR_VIEW,
} from "../actions/calendar";

const ipcRenderer = getIpcRenderer();

function __getInitialSettings(): SettingsType {
	const defSettings: SettingsType = {
		currentNav: "home",
		view: "calendar",
		calendarView: "classicDays",
		capacitiesView: "percentage",
		sort: "earliest",
		weeks: 4,
		pambaPath: "",
		url: process.env.REACT_APP_BACKEND_API,
	};

	if (isElectron()) {
		const Store = window.require("electron-store");
		const store = new Store();

		if (!store.has("settings")) store.set("settings", defSettings);

		const settings: SettingsType = store.get("settings", defSettings);

		setDatabasePath(settings.pambaPath);

		return settings;
	} else {
		return defSettings;
	}
}

function __setSetting(key, value) {
	if (isElectron()) {
		const Store = window.require("electron-store");
		const store = new Store();

		store.set("settings." + key, value);
	}
}

const initialSettings = __getInitialSettings();
const initialState: StateType = {
	token: null,
	settings: initialSettings,
	weekDelta: 0,
	days: prepareDays(0, initialSettings.weeks),
	capacities: [],
	warnings: [],
	jobs: [],
};

function rootReducer(state = initialState, action) {
	if (action.type === ACTION_APP_ACCOUNT_TOKEN_SET) {
		return Object.assign({}, state, {
			token: action.token,
		});
	} else if (action.type === ACTION_SET_CURRENT_NAV) {
		__setSetting("currentNav", action.nav);

		return Object.assign({}, state, {
			settings: Object.assign({}, state.settings, {
				currentNav: action.nav,
			}),
		});
	} else if (action.type === ACTION_SWITCH_VIEW) {
		__setSetting("view", action.view);

		return Object.assign({}, state, {
			settings: Object.assign({}, state.settings, {
				view: action.view,
			}),
		});
	} else if (action.type === ACTION_SWITCH_CALENDAR_VIEW) {
		__setSetting("calendarView", action.view);

		return Object.assign({}, state, {
			settings: Object.assign({}, state.settings, {
				calendarView: action.view,
			}),
		});
	} else if (action.type === ACTION_SWITCH_CAPACITIES_VIEW) {
		__setSetting("capacitiesView", action.view);

		return Object.assign({}, state, {
			settings: Object.assign({}, state.settings, {
				capacitiesView: action.view,
			}),
		});
	} else if (action.type === ACTION_SORT_CALENDAR) {
		__setSetting("sort", action.order);

		const sortConst = action.order === "earliest" ? 1 : -1;

		return Object.assign({}, state, {
			settings: Object.assign({}, state.settings, {
				sort: action.order,
			}),
			jobs: state.jobs.sort((a, b) =>
				a.deadline > b.deadline ? sortConst : -sortConst
			),
		});
	} else if (action.type === ACTION_SET_WEEKS) {
		__setSetting("weeks", action.weeks);

		let newDays = prepareDays(state.weekDelta, action.weeks);
		return Object.assign({}, state, {
			settings: Object.assign({}, state.settings, {
				weeks: action.weeks,
			}),
			days: newDays,
		});
	} else if (action.type === ACTION_SET_PAMBA_PATH) {
		__setSetting("pambaPath", action.path);

		if (ipcRenderer) {
			ipcRenderer.invoke("restartProxy").then((childProcess) => {
				setDatabasePath(action.path);
			});
		}

		return Object.assign({}, state, {
			settings: Object.assign({}, state.settings, {
				pambaPath: action.path,
			}),
		});
	} else if (action.type === ACTION_DAYS_SWITCH) {
		let newWeekDelta;
		if (action.switch === "forward") newWeekDelta = state.weekDelta + 1;
		else if (action.switch === "backward") newWeekDelta = state.weekDelta - 1;
		else if (action.switch === "today") newWeekDelta = 0;

		let newDays = prepareDays(newWeekDelta, state.settings.weeks);
		return Object.assign({}, state, {
			weekDelta: newWeekDelta,
			days: newDays,
		});
	} else if (action.type === ACTION_SET_CALENDAR_DATA) {
		const sortConst = state.settings.sort === "earliest" ? 1 : -1;

		return Object.assign({}, state, {
			capacities: action.data.capacities,
			warnings: action.data.warnings,
			jobs: action.data.jobs.sort((a, b) =>
				a.deadline > b.deadline ? sortConst : -sortConst
			),
		});
	}

	return state;
}

export default rootReducer;
