import closeBlack from '../../icons/close_black.png';
import LoginForm from './Login/LoginForm';
import optimifyLogo from '../../icons/optimify_logo_dark-bg.svg';
import styled from 'styled-components';
import { closeCurrentElectronWindow } from '../../utils/electron';

export const Login = () => {
	return (
		<>
			<TopBar>
				<CloseButton
					onClick={() => {
						closeCurrentElectronWindow();
					}}
					tabIndex="-1"
				>
					<img src={closeBlack} />
				</CloseButton>
			</TopBar>
			<Row key="content">
				<LogoPanel>
					<ProductName>Argos</ProductName>
					<OptimifyLogo src={optimifyLogo} alt="Optimify s. r. o." />
				</LogoPanel>
				<LoginPanel>
					<LoginForm />
				</LoginPanel>
			</Row>
		</>
	);
};

const TopBar = styled.div`
	position: absolute;

	top: 0;
	right: 0;
	left: 0;

	height: 32px;

	-webkit-app-region: drag;
`;

const CloseButton = styled.button`
	position: absolute;

	top: 0;
	right: 0;

	width: 46px;
	height: 32px;

	background: transparent;
	border: 0;

	cursor: pointer;

	-webkit-app-region: no-drag;

	> img {
		opacity: 0.3;

		transition: all 0.2s ease-out;
	}

	&:hover {
		> img {
			opacity: 0.6;
		}
	}

	&:hover,
	&:focus {
		outline: none;
	}
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;

	height: 100%;
`;

const Item = styled.div`
	width: 50%;
	height: 100%;

	padding-top: 32px;
`;

const LogoPanel = styled(Item)`
	position: relative;

	background: radial-gradient(
		circle at 30% 40%,
		rgba(0, 187, 255, 1) 10%,
		rgba(0, 170, 238, 1) 30%,
		rgba(0, 68, 102, 1) 100%
	);

	overflow: hidden;
`;

/*const Welcome = styled.div`
  position: absolute;

  top: 10rem;
  left: 2.05rem;

  line-height: 32px;

  padding: 0 1rem;

  color: ${(props) => props.theme.colors.white};
  font-size: 2rem;
  font-weight: 300;
`;*/

const ProductName = styled.div`
	position: absolute;

	top: 14rem;
	left: -9rem;

	line-height: 32px;

	padding: 0 1rem;

	color: ${(props) => props.theme.colors.white};
	font-size: 16rem;
	font-weight: 500;

	opacity: 0.1;
	transform: rotate(60deg);
`;

const OptimifyLogo = styled.img`
	position: absolute;

	bottom: 24px;
	left: 50%;
	transform: translateX(-50%);

	height: 24px;
`;

const LoginPanel = styled(Item)`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: center;

	padding: 0 2rem 2rem;
`;
