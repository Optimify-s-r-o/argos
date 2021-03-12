import getShifts from '../../../api/shifts/get-shifts';
import React, { useEffect, useState } from 'react';
import Shift from './02_Shifts/Shift';
import styled from 'styled-components';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { phaseTypesWithShifts } from '../../../enums/phases';
import { useTranslation } from 'react-i18next';

interface ShiftsProps {
	token: string;
	url: string;
}

const Shifts = (props: ShiftsProps) => {
	const { t } = useTranslation();
	const phases = phaseTypesWithShifts;

	const [phaseShifts, setPhaseShifts] = useState<object>({});
	const [requestedPhase, setRequestedPhase] = useState<string | null>(
		phases.length ? phases[0] : null
	);

	useEffect(() => {
		if (props.url && props.token) querryNextPhase();
		else alert("ERROR in Settings component!");
	}, []);

	useEffect(() => {
		querryNextPhase();
	}, [phaseShifts]);

	const querryNextPhase = () => {
		if (requestedPhase)
			getShifts(props.token as string, requestedPhase, (data) => {
				setPhaseShifts(
					Object.assign({}, phaseShifts, { [requestedPhase]: data.body })
				);
				setRequestedPhase(
					phases.length > phases.indexOf(requestedPhase) + 1
						? phases[phases.indexOf(requestedPhase) + 1]
						: null
				);
			});
	};

	return (
		<form>
			{phases.map((phase) => (
				<Phase>
					<PhaseHeader>{t("phaseForms:phases." + phase)}</PhaseHeader>
					{phaseShifts.hasOwnProperty(phase) &&
						phaseShifts[phase].map((shift) => (
							<Shift
								initialShift={shift}
								token={props.token}
								url={props.url}
								phase={phase}
							/>
						))}
					<AddShiftButton
						onClick={() => {
							let newArray: Array<object | null> = [];
							if (phaseShifts.hasOwnProperty(phase))
								newArray = [...phaseShifts[phase]];
							newArray.push(null);
							setPhaseShifts(
								Object.assign({}, phaseShifts, {
									[phase]: newArray,
								})
							);
						}}
					>
						<FontAwesomeIcon icon={faPlus} /> {t("settings:shifts.add")}
					</AddShiftButton>
				</Phase>
			))}
		</form>
	);
};

export default Shifts;

const Phase = styled.div`
	margin-bottom: 16px;
`;

const PhaseHeader = styled.div`
	margin-bottom: 8px;

	font-size: 16px;
	font-weight: 400;
`;

const AddShiftButton = styled.div``;
