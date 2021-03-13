import addShift from '../../../../api/shifts/add-shift';
import deleteShift from '../../../../api/shifts/delete-shift';
import editShift from '../../../../api/shifts/edit-shift';
import Input from '../../../forms/Input';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import {
	faCheck,
	faPencilAlt,
	faTimes,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";

interface ShiftProps {
	initialShift: {
		id: string;
		name: string;
		defaultCapacity: number;
		priorityIndex: number;
		type: string;
	} | null;
	url: string;
	token: string;
	phase: string;
}

const Shift = (props: ShiftProps) => {
	const [editing, setEditing] = useState(false);
	const [shift, setShift] = useState(props.initialShift);
	const [isDeleted, setDeleted] = useState(false);
	const [nameInput, setNameInput] = useState(
		props.initialShift ? props.initialShift.name : ""
	);
	const [capacityInput, setCapacityInput] = useState(
		props.initialShift ? props.initialShift.defaultCapacity : 0
	);

	useEffect(() => {
		if (props.initialShift === null) setEditing(true);
	}, []);

	const saveShift = () => {
		console.log("save");
		if (shift === null)
			addShift(props.token, props.phase, nameInput, capacityInput, (data) => {
				setShift(data.body);
				setEditing(false);
			});
		else if (shift)
			editShift(
				props.token,
				props.phase,
				shift.id,
				nameInput,
				capacityInput,
				(data) => {
					setShift(data.body);
					setEditing(false);
				}
			);
	};

	const cancelEdit = () => {
		if (shift === null) setDeleted(true);
		else {
			setEditing(false);
			setNameInput(shift.name);
			setCapacityInput(shift.defaultCapacity);
		}
	};

	const removeShift = () => {
		if (shift)
			deleteShift(props.token, props.phase, shift.id, (data) => {
				setDeleted(true);
			});
	};

	return !isDeleted ? (
		<ShiftElement>
			{editing ? (
				<EditingWrapper>
					<Name>
						<Input
							value={nameInput}
							onChange={(e) => setNameInput(e.target.value)}
						/>
					</Name>
					<Capacity>
						<Input
							value={capacityInput}
							onChange={(e) => setCapacityInput(parseInt(e.target.value))}
						/>
					</Capacity>
					<Button onClick={() => saveShift()}>
						<FontAwesomeIcon icon={faCheck} />
					</Button>
					<Button onClick={() => cancelEdit()}>
						<FontAwesomeIcon icon={faTimes} />
					</Button>
				</EditingWrapper>
			) : (
				<NotEditingWrapper>
					<Name>{shift?.name}</Name>
					<Capacity>{shift?.defaultCapacity}</Capacity>
					<Button onClick={() => setEditing(true)}>
						<FontAwesomeIcon icon={faPencilAlt} />
					</Button>
					<Button onClick={() => removeShift()}>
						<FontAwesomeIcon icon={faTrash} />
					</Button>
				</NotEditingWrapper>
			)}
		</ShiftElement>
	) : (
		<></>
	);
};

export default Shift;

const ShiftElement = styled.div``;

const EditingWrapper = styled.div`
	display: flex;
`;

const NotEditingWrapper = styled.div`
	display: flex;
`;

const Name = styled.div`
	flex-grow: 1;

	input {
		width: calc(100% - 1rem);
	}
`;

const Capacity = styled.div`
	input {
		width: 80px;
	}
`;

const Button = styled.div`
	line-height: 52px;

	padding: 0 0.5rem;

	cursor: pointer;
	opacity: 0.25;
	transition: all 0.2s ease-out;

	&:hover {
		opacity: 1;
	}
`;
