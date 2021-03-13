import Nav from './Main/Nav';
import queryString from 'query-string';
import TitleBar from '../TitleBar';
import Views from './Main/Views';
import { appAccountTokenSet } from '../../actions/app';
import { BrowserWindowConstructorOptions } from 'electron';
import { connect } from 'react-redux';
import { defaultTheme } from '../../styles/theme';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import '../../styles/main.css';

export const MainPath = "/main";
export const MainPathWithParams = (token: string) => "/main?token=" + token;

export const MainSettings: BrowserWindowConstructorOptions = {
	minWidth: 1024,
	show: false,
	frame: false,
	webPreferences: {
		nodeIntegration: true,
	},
	backgroundColor: defaultTheme.colors.white,
	title: "Argos planner",
};

interface MainProps {
	setToken: (token: string) => void;
}

const mapDispatchToProps = (dispatch) => {
	return {
		setToken: (token: string) => dispatch(appAccountTokenSet(token)),
	};
};

const MainComponent = (props: MainProps) => {
	const location = useLocation();

	useEffect(() => {
		const params = queryString.parse(location.search);
		props.setToken(params.token as string);
	}, []);

	return (
		<>
			<TitleBar title="Argos planner" />
			<Nav />
			<Views />
		</>
	);
};

const Main = connect(null, mapDispatchToProps)(MainComponent);

export default Main;
