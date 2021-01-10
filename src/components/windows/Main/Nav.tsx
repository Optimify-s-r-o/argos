import nav, { LargeIconDefinition } from '../../../enums/nav';
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { closeCurrentElectronWindow } from '../../../utils/electron';
import { connect } from 'react-redux';
import { getColorWithOpacity, getMultipliedColor } from '../../../styles/theme';
import { openWindow } from '../../OpenWindow';
import { setCalendarView, setWeeks, sort } from '../../../actions/calendar';
import { setCapacitiesView } from '../../../actions/capacities';
import { setCurrentNav } from '../../../actions/nav';
import { setView } from '../../../actions/view';
import { useTranslation } from 'react-i18next';
import {
  CalendarViewType,
  CapacitiesViewType,
  SortType,
  NavType,
} from '../../../types/settings';

interface NavComponentProps {
  currentNav: NavType;
  view: string;
  calendarView: CalendarViewType;
  capacitiesView: CapacitiesViewType;
  sortState: SortType;
  weeks: number;
  pambaPath: string;
  url: string;
  token: string;
  setCurrentNav: (nav: NavType) => void;
  setView: (string: string) => void;
  setWeeks: (weeks: number) => void;
  setCalendarView: (view: CalendarViewType) => void;
  setCapacitiesView: (view: CapacitiesViewType) => void;
  sort: (string: SortType) => void;
}

const mapStateToProps = (state) => {
  return {
    currentNav: state.settings.currentNav,
    view: state.settings.view,
    calendarView: state.settings.calendarView,
    capacitiesView: state.settings.capacitiesView,
    sortState: state.settings.sort,
    weeks: state.settings.weeks,
    pambaPath: state.settings.pambaPath,
    url: state.settings.url,
    token: state.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentNav: (nav: NavType) => dispatch(setCurrentNav(nav)),
    setView: (view: string) => dispatch(setView(view)),
    setWeeks: (weeks: number) => dispatch(setWeeks(weeks)),
    setCalendarView: (view: CalendarViewType) =>
      dispatch(setCalendarView(view)),
    setCapacitiesView: (view: CapacitiesViewType) =>
      dispatch(setCapacitiesView(view)),
    sort: (order: SortType) => dispatch(sort(order)),
  };
};

const NavComponent = (props: NavComponentProps) => {
  const { t } = useTranslation();

  const navDefinition = nav(props.url, props.token, t, {
    view: props.view,
    viewSetter: props.setView,
    weeks: props.weeks,
    weeksSetter: props.setWeeks,
    sort: props.sortState,
    sortSetter: props.sort,
    capacitiesView: props.capacitiesView,
    capacitiesViewSetter: props.setCapacitiesView,
    calendarView: props.calendarView,
    calendarViewSetter: props.setCalendarView,
  });

  return (
    <NavEl>
      <Tabs>
        {navDefinition.map((tab) => {
          return (
            <TabButton
              onClick={() => props.setCurrentNav(tab.name as NavType)}
              isActive={props.currentNav === tab.name}
              isSpecial={tab.isSpecial}
              isVisible={tab.isVisible}
            >
              {tab.title}
            </TabButton>
          );
        })}
      </Tabs>
      <NavContent>
        {navDefinition.map((tab) => {
          return (
            <TabContent
              className={props.currentNav === tab.name ? 'active' : ''}
              isActive={props.currentNav === tab.name}
            >
              {tab.sections.map((section) => {
                return (
                  <>
                    <Section>
                      <SectionHeader>{section.header}</SectionHeader>
                      {section.items.map((item) => {
                        return <LargeIcon {...item} />;
                      })}
                    </Section>
                  </>
                );
              })}
            </TabContent>
          );
        })}
        <NavContentRight>
          <Section isRight>
            <SectionHeader>{t('nav:user.header')}</SectionHeader>
            <LargeIcon
              type='largeIcon'
              title={t('nav:user.logout')}
              src=''
              onClick={() => {
                openWindow(
                  '/',
                  {
                    maximizable: false,
                    minimizable: false,
                    resizable: false,
                    show: false,
                    frame: false,
                    webPreferences: {
                      nodeIntegration: true,
                    },
                    title: 'Argos planner',
                    backgroundColor: '#004466',
                    width: 640,
                    height: 480,
                  },
                  (w) => {
                    closeCurrentElectronWindow();
                  }
                );
              }}
            />
          </Section>
        </NavContentRight>
      </NavContent>
    </NavEl>
  );
};

let Nav = connect(mapStateToProps, mapDispatchToProps)(NavComponent);
export default Nav;

const NavEl = styled.nav`
  height: 120px;

  background-color: ${(props) => props.theme.nav.background};
  border-bottom: 1px solid ${(props) => props.theme.nav.border};
`;

const Tabs = styled.div`
  display: flex;

  justify-content: flex-start;

  height: 30px;

  background-color: ${(props) => props.theme.colors.primary};
`;

const TabButton = styled.button`
  display: ${(props) => (props.isVisible ? 'block' : 'none')};

  height: 30px;

  margin-left: 2px;
  padding: 0 13px;

  background-color: ${(props) =>
    props.isActive
      ? getMultipliedColor(props.theme.colors.white, 0.953)
      : props.isSpecial
      ? getColorWithOpacity(props.theme.colors.black, 20)
      : 'transparent'};
  border: 0;
  color: ${(props) =>
    props.isActive ? props.theme.colors.primary : props.theme.nav.background};
  font-size: 12px;
  font-weight: 400;

  &:hover {
    background-color: ${(props) =>
      props.isActive
        ? getMultipliedColor(props.theme.colors.white, 0.953)
        : props.isSpecial
        ? getColorWithOpacity(props.theme.colors.white, 10)
        : getColorWithOpacity(props.theme.colors.black, 15)};
  }

  &:active,
  &:focus {
    outline: none;
  }
`;

const navContentLoaded = keyframes`
  from {
    opacity: 0;
    left: 10px;
  }

  to {
    opacity: 1;
    left: 0;
  }
`;

const navContentShow = keyframes`
  from {
    left: 10px;
    opacity: 0;
  }

  to {
    left: 0;
    opacity: 1;
    visibility: visible;
  }
`;

const navContentHide = keyframes`
  from {
    left: 0;
    opacity: 1;
  }

  to {
    left: -10px;
    opacity: 0;
    visibility: hidden;
  }
`;

const NavContent = styled.div`
  display: flex;
  justify-content: flex-end;

  position: relative;

  height: 90px;

  opacity: 0;
  animation: 0.5s ${navContentLoaded} ease-in-out 0.5s;
  animation-fill-mode: forwards;
`;

const NavContentRight = styled.div`
  display: flex;
`;

const TabContent = styled.div`
  position: absolute;
  display: flex;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  visibility: visible;
  animation: 0.5s ${navContentHide} ease-in-out;
  animation-fill-mode: forwards;

  &.active {
    visibility: hidden;
    animation: 0.5s ${navContentShow} ease-in-out;
    animation-fill-mode: forwards;
  }
`;

const Section = styled.div<{ isRight?: boolean }>`
  position: relative;
  display: flex;

  flex-direction: row;

  height: 100%;
  min-width: 80px;

  padding: 0 8px;

  &:after {
    content: '';

    position: absolute;

    top: 4px;
    ${(props) => (props.isRight ? 'left: 0;' : 'right: 0;')}
    bottom: 6px;

    width: 1px;

    background-color: ${(props) => props.theme.nav.border};
  }
`;

const SectionHeader = styled.div`
  position: absolute;

  width: 100%;

  right: 0;
  bottom: 0;
  left: 0;

  padding: 4px 0;

  color: ${(props) => props.theme.colors.black};
  font-size: 12px;
  font-weight: 400;
  text-align: center;
`;

const LargeIcon = (props: LargeIconDefinition) => {
  return (
    <LargeIconEl
      isActive={props.hasOwnProperty('active') ? props.active : false}
      onClick={() => props.onClick()}
    >
      <LargeImg src={props.src} alt={props.title} />
      <LargeIconTitle>{props.title}</LargeIconTitle>
    </LargeIconEl>
  );
};

const LargeImg = styled.img`
  width: 32px;
  height: 32px;

  opacity: 0.7;
`;

const LargeIconEl = styled.button`
  display: flex;

  flex-direction: column;
  align-items: center;

  height: 66px;

  margin: 4px 0 0;
  padding: 0 6px;

  background: ${(props) =>
    props.isActive
      ? getColorWithOpacity(props.theme.colors.black, 15)
      : 'transparent'};
  border: 1px solid transparent;

  ${(props) =>
    props.isActive
      ? `
    ${LargeImg} {
      opacity: 0.8;
    }
  `
      : ''}

  &:hover {
    background: ${(props) => getColorWithOpacity(props.theme.colors.black, 15)};
    border-color: ${(props) =>
      props.isActive
        ? getColorWithOpacity(props.theme.colors.black, 25)
        : 'transparent'};

    ${LargeImg} {
      opacity: 0.8;
    }
  }

  &:active,
  &:focus {
    outline: 0;
  }
`;

const LargeIconTitle = styled.span`
  display: block;

  color: black;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  white-space: pre-line;
`;
