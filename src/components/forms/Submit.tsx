import loaderDark32 from '../../icons/loader-dark-32px.svg';
import styled from 'styled-components';
import {
  ButtonHTMLAttributes,
  useEffect,
  useRef,
  useState
  } from 'react';
import { getColorWithOpacity, getMultipliedColor } from '../../styles/theme';

interface SubmitProps {
	isLoading?: boolean;
	hideDisabled?: boolean;
}

const Submit = (
	props: ButtonHTMLAttributes<HTMLButtonElement> & SubmitProps
) => {
	const childrenEl = useRef<HTMLSpanElement>();
	const [childrenDimensions, setChildrenDimensions] = useState<{
		width: number;
		height: number;
	}>({ width: 0, height: 17 });
	useEffect(() => {
		const newWidth = childrenEl.current ? childrenEl.current.clientWidth : 0;
		const newHeight = childrenEl.current ? childrenEl.current.clientHeight : 17;
		setChildrenDimensions({ width: newWidth, height: newHeight });
	}, [props.children]);

	return (
		<StyledSubmit
			{...props}
			onClick={(e) => {
				let target = e.target;
				while (target.nodeName !== "BUTTON") target = target.parentNode;
				target.blur();

				props.onClick && props.onClick(e);
			}}
			childrenDimensions={childrenDimensions}
		>
			<LoaderImage visible={props.isLoading} src={loaderDark32} />
			<Content ref={childrenEl} visible={!props.isLoading}>
				{props.children}
			</Content>
		</StyledSubmit>
	);
};

export default Submit;

const LoaderImage = styled.img<{ visible: boolean }>`
	position: absolute;

	top: calc(50% - 16px);
	left: calc(50% - 16px);

	opacity: ${(props) => (props.visible ? 1 : 0)};
	transition: all 0.2s ease-out ${(props) => (props.visible ? ".2s" : "")};
`;

const Content = styled.span<{ visible: boolean }>`
	position: absolute;

	top: 50%;
	left: 50%;

	white-space: nowrap;

	opacity: ${(props) => (props.visible ? 1 : 0)};
	transition: all 0.2s ease-out ${(props) => (props.visible ? ".2s" : "")};
	transform: translate(-50%, -50%);
`;

const StyledSubmit = styled.button<{
	isLoading?: boolean;
	hideDisabled?: boolean;
	childrenDimensions: { width: number; height: number };
}>`
	position: relative;
	box-sizing: content-box;

	width: ${(props) =>
		props.isLoading ? "32px" : props.childrenDimensions.width + "px"};
	height: ${(props) => props.childrenDimensions.height + "px"};

	margin: 0.5rem 1rem;
	padding: 0.75rem 1.5rem;

	background: ${(props) => props.theme.colors.accent};
	border: 0;
	border-radius: 999px;
	box-shadow: 0 5px 10px -5px rgba(0, 0, 0, 0.25);
	color: ${(props) => props.theme.colors.primary};
	font-family: "Segoe UI";
	font-weight: 500;
	text-transform: uppercase;

	cursor: pointer;
	transition: all 0.2s ease-out;

	&:hover:not(:disabled) {
		background: ${(props) =>
			getMultipliedColor(props.theme.colors.accent, 1.1)};
		box-shadow: 0 5px 25px -10px rgba(0, 0, 0, 0.5);
	}

	&:focus {
		background: ${(props) =>
			getMultipliedColor(props.theme.colors.accent, 1.2)};
		box-shadow: 0 5px 25px -5px ${(props) => props.theme.colors.accent};

		outline: 0;
	}

	&:disabled {
		background: ${(props) =>
			getColorWithOpacity(props.theme.colors.accent, 75)};

		cursor: default;
		opacity: ${(props) => (props.hideDisabled ? 0 : 100)};
	}
`;
