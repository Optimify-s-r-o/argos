import capacitiesAbsolute from '../../../icons/capacities_absolute.png';
import capacitiesPercentual from '../../../icons/capacities_percentual.png';
import classicCapacities from '../../../icons/style_capacities.png';
import classicDays from '../../../icons/style_dates.png';
import compact from '../../../icons/style_compact.png';
import deadlineEarliest from '../../../icons/deadline_earliest.png';
import deadlineLatest from '../../../icons/deadline_latest.png';
import generateDocument from '../../../icons/generate_special.png';
import getPlates from '../../../api/proxy/get-plates';
import inventory from '../../../icons/inventure.png';
import months from '../../../icons/months.png';
import React from 'react';
import reloadPlates from '../../../api/reload-plates';
import settings from '../../../icons/settings-icon.png';
import styled, { keyframes } from 'styled-components';
import view from '../../../icons/view.png';
import weeks from '../../../icons/weeks.png';
import { connect } from 'react-redux';
import { getColorWithOpacity, getMultipliedColor } from '../../../styles/theme';
import { openWindow } from '../../OpenWindow';
import { setCalendarView, setWeeks, sort } from '../../../actions/calendar';
import { setCapacitiesView } from '../../../actions/capacities';
import { setCurrentNav } from '../../../actions/nav';
import { SettingsPath, SettingsSettings } from '../Settings';
import { setView } from '../../../actions/view';
import { useTranslation } from 'react-i18next';
import {
  GenerateDocumentPath,
  GenerateDocumentSettings,
} from '../GenerateDocument';
import {
  MSGBOX_BUTTONS_OK,
  MSGBOX_TYPE_INFO,
  showMessageBox,
} from '../../../utils/showMessageBox';
import {
  ViewType,
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
  setView: (string: ViewType) => void;
  setWeeks: (weeks: number) => void;
  setCalendarView: (view: CalendarViewType) => void;
  setCapacitiesView: (view: CapacitiesViewType) => void;
  sort: (string: SortType) => void;
}

type NavDefinition = Array<TabDefinition>;

interface TabDefinition {
  name: string;
  title: string;
  isSpecial?: boolean;
  isVisible?: boolean;
  sections: Array<SectionDefinition>;
}

interface SectionDefinition {
  header: string;
  items: Array<LargeIconDefinition>;
}

interface LargeIconDefinition {
  type: 'largeIcon';
  onClick: () => void;
  active?: boolean;
  src: string;
  title: string;
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
    setView: (view: ViewType) => dispatch(setView(view)),
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

  const callReloadPlates = () => {
    alert('TODO: fix'); // TODO
    getPlates((data) => {
      reloadPlates(props.url, props.token, data.body, (data) => {
        showMessageBox('plates:reloaded', MSGBOX_TYPE_INFO, MSGBOX_BUTTONS_OK);
      });
    });
  };

  const nav: NavDefinition = [
    {
      name: 'home',
      title: t('nav:tabs.home'),
      sections: [
        {
          header: t('nav:home.view.header'),
          items: [
            {
              type: 'largeIcon',
              onClick: () => props.setView('calendar'),
              active: props.view === 'calendar',
              src: weeks,
              title: t('nav:home.view.calendar'),
            },
            {
              type: 'largeIcon',
              onClick: () => props.setView('jobs'),
              active: props.view === 'jobs',
              src: view,
              title: t('nav:home.view.jobs'),
            },
          ],
        },
        {
          header: t('nav:home.forms.header'),
          items: [
            {
              type: 'largeIcon',
              onClick: () => {
                openWindow(GenerateDocumentPath, GenerateDocumentSettings);
              },
              src: generateDocument,
              title: t('nav:home.forms.generateDocument'),
            },
          ],
        },
        {
          header: t('nav:home.actions.header'),
          items: [
            {
              type: 'largeIcon',
              onClick: () => callReloadPlates(),
              src: '',
              title: t('nav:home.actions.reloadPlates'),
            },
          ],
        },
        {
          header: t('nav:home.settings.header'),
          items: [
            {
              type: 'largeIcon',
              onClick: () =>
                openWindow(
                  SettingsPath +
                    '?url=' +
                    props.url +
                    '&pambaPath=' +
                    props.pambaPath +
                    '&token=' +
                    props.token,
                  SettingsSettings
                ),
              src: settings,
              title: t('nav:home.settings.settings'),
            },
          ],
        },
      ],
    },
    {
      name: 'material',
      title: t('nav:tabs.material'),
      sections: [
        {
          header: t('nav:material.inventory.header'),
          items: [
            {
              type: 'largeIcon',
              onClick: () => alert('TODO'),
              src: inventory,
              title: t('nav:material.inventory.inventory'),
            },
          ],
        },
      ],
    },
    {
      name: 'calendarView',
      title: t('nav:tabs.calendarView'),
      isSpecial: true,
      isVisible: true, // TODO
      sections: [
        {
          header: t('nav:calendarView.period.header'),
          items: [
            {
              type: 'largeIcon',
              onClick: () => props.setWeeks(4),
              active: props.weeks === 4,
              src: months,
              title: t('nav:calendarView.period.months'),
            },
            {
              type: 'largeIcon',
              onClick: () => props.setWeeks(1),
              active: props.weeks === 1,
              src: weeks,
              title: t('nav:calendarView.period.weeks'),
            },
          ],
        },
        {
          header: t('nav:calendarView.sort.header'),
          items: [
            {
              type: 'largeIcon',
              onClick: () => props.sort('earliest'),
              active: props.sortState === 'earliest',
              src: deadlineEarliest,
              title: t('nav:calendarView.sort.deadlineEarliest'),
            },
            {
              type: 'largeIcon',
              onClick: () => props.sort('latest'),
              active: props.sortState === 'latest',
              src: deadlineLatest,
              title: t('nav:calendarView.sort.deadlineLatest'),
            },
          ],
        },
        {
          header: t('nav:calendarView.capacitiesView.header'),
          items: [
            {
              type: 'largeIcon',
              onClick: () => props.setCapacitiesView('percentage'),
              active: props.capacitiesView === 'percentage',
              src: capacitiesPercentual,
              title: t('nav:calendarView.capacitiesView.percentual'),
            },
            {
              type: 'largeIcon',
              onClick: () => props.setCapacitiesView('absolute'),
              active: props.capacitiesView === 'absolute',
              src: capacitiesAbsolute,
              title: t('nav:calendarView.capacitiesView.absolute'),
            },
          ],
        },
        {
          header: t('nav:calendarView.phaseView.header'),
          items: [
            {
              type: 'largeIcon',
              onClick: () => {
                props.setCalendarView('classicDays');
              },
              active: props.calendarView === 'classicDays',
              src: classicDays,
              title: t('nav:calendarView.phaseView.classicDays'),
            },
            {
              type: 'largeIcon',
              onClick: () => {
                props.setCalendarView('classicCapacities');
              },
              active: props.calendarView === 'classicCapacities',
              src: classicCapacities,
              title: t('nav:calendarView.phaseView.classicCapacities'),
            },
            {
              type: 'largeIcon',
              onClick: () => {
                props.setCalendarView('compact');
              },
              active: props.calendarView === 'compact',
              src: compact,
              title: t('nav:calendarView.phaseView.compact'),
            },
          ],
        },
      ],
    },
    {
      name: 'jobsView',
      title: t('nav:tabs.jobsView'),
      isSpecial: true,
      isVisible: true, // TODO
      sections: [],
    },
    {
      name: 'dev',
      title: 'Developement',
      isSpecial: false,
      isVisible: true,
      sections: [
        {
          header: 'Message boxes',
          items: [
            {
              type: 'largeIcon',
              onClick: () => {
                showMessageBox('Success message', 'success', [
                  'yes',
                  'no',
                  'ok',
                  'cancel',
                ]);
              },
              active: false,
              src: '',
              title: 'Success',
            },
            {
              type: 'largeIcon',
              onClick: () => {
                showMessageBox('Info message', 'info', [
                  'yes',
                  'no',
                  'ok',
                  'cancel',
                ]);
              },
              active: false,
              src: '',
              title: 'Info',
            },
            {
              type: 'largeIcon',
              onClick: () => {
                showMessageBox('Warning message', 'warning', [
                  'yes',
                  'no',
                  'ok',
                  'cancel',
                ]);
              },
              active: false,
              src: '',
              title: 'Warning',
            },
            {
              type: 'largeIcon',
              onClick: () => {
                showMessageBox('Error message', 'error', [
                  'yes',
                  'no',
                  'ok',
                  'cancel',
                ]);
              },
              active: false,
              src: '',
              title: 'Error',
            },
          ],
        },
      ],
    },
  ];

  return (
    <NavEl>
      <Tabs>
        {nav.map((tab) => {
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
        {nav.map((tab) => {
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
  position: relative;

  height: 90px;

  opacity: 0;
  animation: 0.5s ${navContentLoaded} ease-in-out 0.5s;
  animation-fill-mode: forwards;
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

const Section = styled.div`
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
    right: 0;
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
