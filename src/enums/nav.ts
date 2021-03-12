import capacitiesAbsolute from '../icons/capacities_absolute.png';
import capacitiesPercentual from '../icons/capacities_percentual.png';
import classicCapacities from '../icons/style_capacities.png';
import classicDays from '../icons/style_dates.png';
import compact from '../icons/style_compact.png';
import deadlineEarliest from '../icons/deadline_earliest.png';
import deadlineLatest from '../icons/deadline_latest.png';
import inventory from '../icons/inventure.png';
import months from '../icons/months.png';
import weeks from '../icons/weeks.png';
import { callReloadPlates } from '../utils/helper-functions';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { openWindow } from '../components/OpenWindow';
import { SettingsPath, SettingsSettings } from '../components/windows/Settings';
import { TFunction } from 'i18next';
import {
	faBriefcase,
	faCheck,
	faCogs,
	faDolly,
	faExclamationCircle,
	faExclamationTriangle,
	faFileExport,
	faInfo,
	faPlusCircle,
	faQuestion,
	faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
	GenerateDocumentPath,
	GenerateDocumentSettings,
} from "../components/windows/GenerateDocument";
import {
	CalendarViewType,
	CapacitiesViewType,
	SortType,
} from "../types/settings";
import {
	MSGBOX_BUTTONS_OK,
	MSGBOX_TYPE_SUCCESS,
	showMessageBox,
} from "../utils/showMessageBox";

type NavDefinition = Array<TabDefinition>;

interface TabDefinition {
	name: string;
	title: string;
	isSpecial?: boolean;
	isVisible?: boolean;
	sections: Array<SectionDefinition>;
}

interface SectionDefinition {
	header: string;
	items: Array<LargeIconDefinition | LargeFAIconDefinition>;
}

export interface LargeIconDefinition {
	type: "largeIcon";
	onClick: () => void;
	active?: boolean;
	src: string;
	title: string;
}
export interface LargeFAIconDefinition {
	type: "largeFAIcon";
	onClick: () => void;
	active?: boolean;
	icon: IconDefinition;
	title: string;
}

interface StateData {
	view: string;
	viewSetter: (view: string) => void;
	weeks: number;
	weeksSetter: (weeks: number) => void;
	sort: SortType;
	sortSetter: (sort: SortType) => void;
	capacitiesView: CapacitiesViewType;
	capacitiesViewSetter: (capacityView: CapacitiesViewType) => void;
	calendarView: CalendarViewType;
	calendarViewSetter: (calendarView: CalendarViewType) => void;
}

const nav = (
	url: string,
	token: string,
	t: TFunction,
	stateData: StateData
): NavDefinition => {
	return [
		{
			name: "common",
			title: t("nav:tabs.common"),
			isVisible: true,
			sections: [
				{
					header: t("nav:common.view.header"),
					items: [
						{
							type: "largeFAIcon",
							onClick: () => stateData.viewSetter("calendar"),
							active: stateData.view === "calendar",
							icon: faCalendarAlt,
							title: t("nav:common.view.calendar"),
						},
						{
							type: "largeFAIcon",
							onClick: () => stateData.viewSetter("jobs"),
							active: stateData.view === "jobs",
							icon: faBriefcase,
							title: t("nav:common.view.jobs"),
						},
						{
							type: "largeFAIcon",
							onClick: () => stateData.viewSetter("transports"),
							active: stateData.view === "transports",
							icon: faDolly,
							title: t("nav:common.view.transports"),
						},
					],
				},
				{
					header: t("nav:common.forms.header"),
					items: [
						{
							type: "largeFAIcon",
							onClick: () => {
								openWindow(GenerateDocumentPath, GenerateDocumentSettings);
							},
							icon: faFileExport,
							title: t("nav:common.forms.generateDocument"),
						},
					],
				},
				{
					header: t("nav:common.actions.header"),
					items: [
						{
							type: "largeFAIcon",
							onClick: () =>
								callReloadPlates(token, () => {
									showMessageBox(
										"plates:reloaded",
										MSGBOX_TYPE_SUCCESS,
										MSGBOX_BUTTONS_OK
									);
								}),
							icon: faSyncAlt,
							title: t("nav:common.actions.reloadPlates"),
						},
					],
				},
				{
					header: t("nav:common.settings.header"),
					items: [
						{
							type: "largeFAIcon",
							onClick: () =>
								openWindow(
									SettingsPath + "?url=" + url + "&token=" + token,
									SettingsSettings
								),
							icon: faCogs,
							title: t("nav:common.settings.settings"),
						},
					],
				},
			],
		},
		{
			name: "material",
			title: t("nav:tabs.material"),
			isVisible: true,
			sections: [
				{
					header: t("nav:material.inventory.header"),
					items: [
						{
							type: "largeIcon",
							onClick: () => alert("TODO"),
							src: inventory,
							title: t("nav:material.inventory.inventory"),
						},
					],
				},
			],
		},
		{
			name: "calendarView",
			title: t("nav:tabs.calendarView"),
			isSpecial: true,
			isVisible: stateData.view === "calendar",
			sections: [
				{
					header: t("nav:calendarView.period.header"),
					items: [
						{
							type: "largeIcon",
							onClick: () => stateData.weeksSetter(4),
							active: stateData.weeks === 4,
							src: months,
							title: t("nav:calendarView.period.months"),
						},
						{
							type: "largeIcon",
							onClick: () => stateData.weeksSetter(1),
							active: stateData.weeks === 1,
							src: weeks,
							title: t("nav:calendarView.period.weeks"),
						},
					],
				},
				{
					header: t("nav:calendarView.sort.header"),
					items: [
						{
							type: "largeIcon",
							onClick: () => stateData.sortSetter("earliest"),
							active: stateData.sort === "earliest",
							src: deadlineEarliest,
							title: t("nav:calendarView.sort.deadlineEarliest"),
						},
						{
							type: "largeIcon",
							onClick: () => stateData.sortSetter("latest"),
							active: stateData.sort === "latest",
							src: deadlineLatest,
							title: t("nav:calendarView.sort.deadlineLatest"),
						},
					],
				},
				{
					header: t("nav:calendarView.capacitiesView.header"),
					items: [
						{
							type: "largeIcon",
							onClick: () => stateData.capacitiesViewSetter("percentage"),
							active: stateData.capacitiesView === "percentage",
							src: capacitiesPercentual,
							title: t("nav:calendarView.capacitiesView.percentual"),
						},
						{
							type: "largeIcon",
							onClick: () => stateData.capacitiesViewSetter("absolute"),
							active: stateData.capacitiesView === "absolute",
							src: capacitiesAbsolute,
							title: t("nav:calendarView.capacitiesView.absolute"),
						},
					],
				},
				{
					header: t("nav:calendarView.phaseView.header"),
					items: [
						{
							type: "largeIcon",
							onClick: () => {
								stateData.calendarViewSetter("classicDays");
							},
							active: stateData.calendarView === "classicDays",
							src: classicDays,
							title: t("nav:calendarView.phaseView.classicDays"),
						},
						{
							type: "largeIcon",
							onClick: () => {
								stateData.calendarViewSetter("classicCapacities");
							},
							active: stateData.calendarView === "classicCapacities",
							src: classicCapacities,
							title: t("nav:calendarView.phaseView.classicCapacities"),
						},
						{
							type: "largeIcon",
							onClick: () => {
								stateData.calendarViewSetter("compact");
							},
							active: stateData.calendarView === "compact",
							src: compact,
							title: t("nav:calendarView.phaseView.compact"),
						},
					],
				},
			],
		},
		{
			name: "jobsView",
			title: t("nav:tabs.jobsView"),
			isSpecial: true,
			isVisible: stateData.view === "jobs",
			sections: [],
		},
		{
			name: "transportsView",
			title: t("nav:tabs.transportsView"),
			isSpecial: true,
			isVisible: stateData.view === "transports",
			sections: [
				{
					header: t("nav:transportsView.transports.header"),
					items: [
						{
							type: "largeFAIcon",
							onClick: () => null,
							/*openWindow(
                  SettingsPath + '?url=' + url + '&token=' + token,
                  SettingsSettings
                )*/ icon: faPlusCircle,
							title: t("nav:transportsView.transports.add"),
						},
					],
				},
			],
		},
		{
			name: "dev",
			title: "Developement",
			isSpecial: false,
			isVisible: true,
			sections: [
				{
					header: "Message boxes",
					items: [
						{
							type: "largeFAIcon",
							onClick: () => {
								showMessageBox("Success message", "success", ["ok"]);
							},
							active: false,
							icon: faCheck,
							title: "Success",
						},
						{
							type: "largeFAIcon",
							onClick: () => {
								showMessageBox("Info message", "info", ["ok"]);
							},
							active: false,
							icon: faInfo,
							title: "Info",
						},
						{
							type: "largeFAIcon",
							onClick: () => {
								showMessageBox("Warning message", "warning", ["ok", "cancel"]);
							},
							active: false,
							icon: faExclamationTriangle,
							title: "Warning",
						},
						{
							type: "largeFAIcon",
							onClick: () => {
								showMessageBox("Error message", "error", ["ok"]);
							},
							active: false,
							icon: faExclamationCircle,
							title: "Error",
						},
						{
							type: "largeFAIcon",
							onClick: () => {
								showMessageBox("Question message", "question", ["yes", "no"]);
							},
							active: false,
							icon: faQuestion,
							title: "Question",
						},
					],
				},
			],
		},
	];
};

export default nav;
