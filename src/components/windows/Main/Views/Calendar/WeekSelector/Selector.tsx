import styled from 'styled-components';
import { CharButton } from '../../../../../../styles/global';
import { connect } from 'react-redux';
import { switchBackward, switchForward } from '../../../../../../actions/days';
import { useTranslation, withTranslation } from 'react-i18next';

const mapStateToProps = (state) => {
	return { days: state.days };
};

function mapDispatchToProps(dispatch) {
	return {
		switchForward: () => dispatch(switchForward()),
		switchBackward: () => dispatch(switchBackward()),
	};
}

interface SelectorProps {
	days: Date[];
	switchForward: () => void;
	switchBackward: () => void;
}

const SelectorComponent = (props: SelectorProps) => {
	const { i18n } = useTranslation();

	return (
		<SelectorEl>
			<CharButton onClick={props.switchBackward}>&lt;</CharButton>
			<DaysText>
				{props.days[0].toLocaleDateString(i18n.language)} -{" "}
				{props.days[props.days.length - 1].toLocaleDateString(i18n.language)}
			</DaysText>
			<CharButton onClick={props.switchForward}>&gt;</CharButton>
		</SelectorEl>
	);
};

const Selector = connect(
	mapStateToProps,
	mapDispatchToProps
)(SelectorComponent);

export default withTranslation()(Selector);

const SelectorEl = styled.div`
	display: flex;

	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

const DaysText = styled.span`
	display: inline-block;

	font-size: 18px;

	margin: 0 32px;
`;
