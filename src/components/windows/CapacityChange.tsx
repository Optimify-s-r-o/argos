import Cancel from '../forms/Cancel';
import getJob from '../../api/jobs/get-single';
import getShifts from '../../api/shifts/get-shifts';
import Input from '../forms/Input';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import Submit from '../forms/Submit';
import TitleBar from '../TitleBar';
import { getLocalizedDate } from '../../utils/days';
import { Row } from '../../styles/global';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import '../../styles/forms.css';
import '../../styles/main.css';
import phasePartEdit, {
	ShiftCapacityType,
} from "../../api/phase/edit-phase-part";
import {
	FormBackground,
	FormCard,
	FormCardButtons,
	FormColumn,
} from "../../styles/forms";
import {
	closeCurrentElectronWindow,
	setCurrentElectronWindowHeight,
	setCurrentElectronWindowTitle,
} from "../../utils/electron";
import {
	MSGBOX_BUTTONS_OK,
	MSGBOX_BUTTONS_YES_NO,
	MSGBOX_BUTTON_YES,
	MSGBOX_TYPE_ERROR,
	MSGBOX_TYPE_QUESTION,
	MSGBOX_TYPE_SUCCESS,
	showMessageBox,
} from "../../utils/showMessageBox";
import FormRow, {
	FormInfo,
	FormInfoContent,
	FormInfoHeader,
	FormInfoRow,
} from "../forms/FormRow";

const title = "capacityForms:titleBar";

const CapacityChangePath = "/capacity-change";

const CapacityChangePathWithParams = (
	token: string,
	jobGuid: string,
	phase: string
) => {
	return (
		"/capacity-change?url=" +
		process.env.REACT_APP_BACKEND_API +
		"&token=" +
		token +
		"&jobGuid=" +
		jobGuid +
		"&phase=" +
		phase
	);
};

const CapacityChangeSettings = {
	width: 458,
	height: 307,
	maximizable: false,
	resizable: false,
};

interface DaysFormat {
	guid: string;
	date: Date;
	shift: string;
	value: number;
}

const CapacityChange = () => {
	const location = useLocation();
	const params = queryString.parse(location.search);

	const [shifts, setShifts] = useState<object>({});
	const [jobId, setJobId] = useState();
	const [phase] = useState(params.phase as string);
	const [requiredCapacity, setRequiredCapacity] = useState(0);
	const [freeCapacity, setFreeCapacity] = useState(0);
	const [days, setDays] = useState<Array<DaysFormat>>([]);
	const [phaseParts, setPhaseParts] = useState<Array<string>>([]);
	const [capacitiesToSave, setCapacitiesToSave] = useState(-1);
	const { t, i18n } = useTranslation();

	useEffect(() => {
		getShifts(params.token as string, phase, (data) => {
			let newShifts = {};
			data.body.forEach((shift) => (newShifts[shift.id] = shift.name));
			setShifts(newShifts);
		});
	}, []);

	useEffect(() => {
		if (Object.entries(shifts).length > 0) {
			getJob(params.token as string, params.jobGuid as string, (data) => {
				setJobId(data.body.name);
				setRequiredCapacity(data.body[phase].capacity);
				setFreeCapacity(data.body[phase].notAllocatedCapacity);

				setCurrentElectronWindowTitle(
					t(title) +
						": " +
						data.body.name +
						", " +
						t("phaseForms:phases." + phase)
				);

				let daysData: Array<DaysFormat> = [];
				let phasePartsData: Array<string> = [];
				data.body[phase].workingPhaseParts.forEach((part) => {
					phasePartsData.push(part.id);
					Object.keys(shifts).forEach((shiftGuid) => {
						daysData.push({
							guid: part.id,
							date: new Date(Date.parse(part.day)),
							shift: shiftGuid,
							value: part.shifts.some((el) => el.shiftId === shiftGuid)
								? part.shifts.find((el) => el.shiftId === shiftGuid).planned
								: 0,
						});
					});
				});
				daysData.sort((a, b) =>
					a.date > b.date ? 1 : a.date < b.date ? -1 : 0
				);
				setPhaseParts(phasePartsData);
				setDays(daysData);

				setCurrentElectronWindowHeight(307 + 85 * daysData.length, true);
			});
		}
	}, [shifts]);

	const handleDayChange = (event) => {
		const target = event.target;
		const index = target.name;

		if (target.value >= 0) {
			let newDays: Array<DaysFormat> = [];
			for (let i = 0; i < days.length; i++) {
				newDays[i] = Object.assign({}, days[i]);
			}
			newDays[index].value = target.value;

			let newFreeCapacity = requiredCapacity;
			newDays.forEach((day) => {
				newFreeCapacity -= day.value;
			});

			if (newFreeCapacity >= 0) {
				setFreeCapacity(newFreeCapacity);
				setDays(newDays);
			}
		}
	};

	const handleSaveCapacities = () => {
		if (freeCapacity > 0)
			showMessageBox(
				"capacityForms:freeCapacityWarning",
				MSGBOX_TYPE_QUESTION,
				MSGBOX_BUTTONS_YES_NO,
				(button) => {
					if (button === MSGBOX_BUTTON_YES) doHandleSaveCapacities();
				}
			);
		else doHandleSaveCapacities();
	};

	const doHandleSaveCapacities = () => {
		setCapacitiesToSave(phaseParts.length);
	};

	useEffect(() => {
		console.log(capacitiesToSave);

		if (capacitiesToSave > 0) {
			const phasePart = phaseParts[phaseParts.length - capacitiesToSave];

			const partDays = days.filter((day) => day.guid === phasePart);

			let shiftsData: Array<ShiftCapacityType> = [];
			partDays.forEach((day) => {
				shiftsData.push({ shiftGuid: day.shift, capacity: day.value });
			});

			phasePartEdit(
				params.token as string,
				phasePart,
				shiftsData,
				phase,
				(data) => {
					if (data.status === 200) setCapacitiesToSave(capacitiesToSave - 1);
					else {
						showMessageBox(
							"capacityForms:error",
							MSGBOX_TYPE_ERROR,
							MSGBOX_BUTTONS_OK
						);
						setCapacitiesToSave(-1);
					}
				}
			);
		} else if (capacitiesToSave === 0) {
			showMessageBox(
				"capacityForms:success",
				MSGBOX_TYPE_SUCCESS,
				MSGBOX_BUTTONS_YES_NO,
				(button) => {
					if (button === MSGBOX_BUTTON_YES) closeCurrentElectronWindow();
					else setCapacitiesToSave(-1);
				}
			);
		}
	}, [capacitiesToSave]);

	return (
		<FormBackground>
			<TitleBar
				title={t(title) + ": " + jobId + ", " + t("phaseForms:phases." + phase)}
				icon={false}
			/>
			<Row>
				<FormColumn>
					<FormCard>
						<FormRow title={t("capacityForms:capacities")}>
							<FormInfo>
								<FormInfoRow>
									<FormInfoHeader>
										{t("capacityForms:requiredCapacity")}
									</FormInfoHeader>
									<FormInfoContent>{requiredCapacity}</FormInfoContent>
								</FormInfoRow>
								<FormInfoRow>
									<FormInfoHeader>
										{t("capacityForms:freeCapacity")}
									</FormInfoHeader>
									<FormInfoContent>{freeCapacity}</FormInfoContent>
								</FormInfoRow>
							</FormInfo>
						</FormRow>

						{days.map((day, index) => {
							return (
								<FormRow
									title={
										getLocalizedDate(day.date, i18n.language) +
										", " +
										t("capacityForms:shift") +
										": " +
										shifts[day.shift]
									}
								>
									<Input
										name={index.toString()}
										type="number"
										value={day.value}
										onChange={handleDayChange}
									/>
								</FormRow>
							);
						})}
					</FormCard>

					<FormCardButtons>
						<Cancel onClick={() => closeCurrentElectronWindow()}>
							{t("messageBox:buttons.cancel")}
						</Cancel>
						<Submit
							onClick={() => handleSaveCapacities()}
							isLoading={capacitiesToSave > 0}
						>
							{t("capacityForms:saveCapacity")}
						</Submit>
					</FormCardButtons>
				</FormColumn>
			</Row>
		</FormBackground>
	);
};

export {
	CapacityChange,
	CapacityChangePath,
	CapacityChangePathWithParams,
	CapacityChangeSettings,
};
