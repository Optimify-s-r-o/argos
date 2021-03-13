import styled from 'styled-components';
import { connect } from 'react-redux';
import { switchToday } from '../../../../../../actions/days';
import { TextButton } from '../../../../../../styles/global';
import { useTranslation } from 'react-i18next';

const mapStateToProps = (state) => {
	return { weekDelta: state.weekDelta };
};

function mapDispatchToProps(dispatch) {
	return {
		switchToday: () => dispatch(switchToday()),
	};
}

interface CurrentWeekProps {
	weekDelta: number;
	switchToday: () => void;
}

const CurrentWeekComponent = (props: CurrentWeekProps) => {
	const { t } = useTranslation();

	const handleSwitchToday = () => {
		props.switchToday();
	};

	return (
		<CurrentWeekEl>
			{props.weekDelta !== 0 && (
				<TextButton onClick={handleSwitchToday}>
					{t("calendar:weekSelector.currentWeek")}
				</TextButton>
			)}
		</CurrentWeekEl>
	);
};

const CurrentWeek = connect(
	mapStateToProps,
	mapDispatchToProps
)(CurrentWeekComponent);

export default CurrentWeek;

const CurrentWeekEl = styled.div`
	display: flex;

	flex-direction: row;
	align-items: center;
	justify-content: flex-start;

	padding: 0 32px;
`;
