import ReactSelect from 'react-select';
import styled from 'styled-components';
import { getColorWithOpacity } from '../../styles/theme';

const Select = (props) => {
	return (
		<ReactSelectWrapper>
			<ReactSelect
				className="react-select-container"
				classNamePrefix="react-select"
				placeholder=""
				{...props}
			/>
		</ReactSelectWrapper>
	);
};

export default Select;

const ReactSelectWrapper = styled.div`
	.react-select-container {
		margin: 0.5rem 1rem;

		font-family: "Segoe UI";
	}

	.react-select__control {
		border: 0;
		border-radius: 999px;
		box-shadow: 0 5px 10px -5px ${(props) =>
				getColorWithOpacity(props.theme.colors.primary, 25)} ${(props) => (props.hasError ? ", inset 0 0 0 1px " + props.theme.colors.danger : "")};

		transition: box-shadow 0.2s ease-out;
	}

	.react-select__control--is-focused {
		box-shadow: 0 5px 25px -10px ${(props) =>
				getColorWithOpacity(props.theme.colors.accent, 50)} ${(props) => (props.hasError ? ", inset 0 0 0 1px " + props.theme.colors.danger : "")};

		outline: 0;
	}

	.react-select__value-container {
		height: 38px;

		padding: 0.75rem 1.5rem;

		cursor: text;

		.react-select__placeholder {
			margin: 0;
			padding: 0;
		}

		> div:last-child {
			margin: 0;
			padding: 0;
		}
	}

	.react-select__single-value {
		color: #004466 !important;
	}

	.react-select__menu {
		border: 0;
		border-radius: 19px;
		box-shadow: 0 5px 10px -5px rgba(0, 0, 0, 0.25);

		overflow: hidden;
	}

	.react-select__option--is-focused {
		background-color: rgba(0, 68, 102, 0.1) !important;
	}

	.react-select__option--is-selected {
		background-color: #00bbff !important;
	}

	.react-select__input > input {
		margin: 0;
	}
`;
