import styled from 'styled-components';
import { ButtonHTMLAttributes } from 'react';
import { getColorWithOpacity } from '../../styles/theme';

const Cancel = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<StyledCancel {...props} type="cancel">
			{props.children}
		</StyledCancel>
	);
};

export default Cancel;

const StyledCancel = styled.button`
	position: relative;
	box-sizing: content-box;

	margin: 0.5rem 1rem;
	padding: 0.75rem 1.5rem;

	background: ${(props) => getColorWithOpacity(props.theme.colors.black, 0.0)};
	border: 0;
	border-radius: 999px;
	box-shadow: 0 5px 25px -10px ${(props) => getColorWithOpacity(props.theme.colors.black, 0)};
	color: ${(props) => props.theme.colors.white};
	font-family: "Segoe UI";
	font-weight: 500;
	text-transform: uppercase;

	cursor: pointer;
	transition: all 0.2s ease-out;

	&:hover {
		background: ${(props) => getColorWithOpacity(props.theme.colors.black, 20)};
		box-shadow: 0 5px 25px -10px ${(props) => getColorWithOpacity(props.theme.colors.black, 15)};
	}

	&:focus {
		background: ${(props) => getColorWithOpacity(props.theme.colors.black, 25)};
		box-shadow: 0 5px 25px -10px ${(props) => getColorWithOpacity(props.theme.colors.black, 20)};

		outline: 0;
	}
`;
