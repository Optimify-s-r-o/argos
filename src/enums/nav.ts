import capacitiesAbsolute from '../icons/capacities_absolute.png';
import capacitiesPercentual from '../icons/capacities_percentual.png';
import classicCapacities from '../icons/style_capacities.png';
import classicDays from '../icons/style_dates.png';
import compact from '../icons/style_compact.png';
import deadlineEarliest from '../icons/deadline_earliest.png';
import deadlineLatest from '../icons/deadline_latest.png';
import generateDocument from '../icons/generate_special.png';
import inventory from '../icons/inventure.png';
import months from '../icons/months.png';
import settings from '../icons/settings-icon.png';
import viewIcon from '../icons/view.png';
import weeks from '../icons/weeks.png';
import { callReloadPlates } from '../utils/helper-functions';
import { openWindow } from '../components/OpenWindow';
import { SettingsPath, SettingsSettings } from '../components/windows/Settings';
import { TFunction } from 'i18next';
import {
  GenerateDocumentPath,
  GenerateDocumentSettings,
} from '../components/windows/GenerateDocument';
import {
  MSGBOX_BUTTONS_OK,
  MSGBOX_TYPE_SUCCESS,
  showMessageBox,
} from '../utils/showMessageBox';
import {
  CalendarViewType,
  CapacitiesViewType,
  SortType,
} from '../types/settings';

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

export interface LargeIconDefinition {
  type: 'largeIcon';
  onClick: () => void;
  active?: boolean;
  src: string;
  title: string;
}

interface StateData {
  view: string;
  viewSetter: (view: string) => void;
  weeks: number;
  weeksSetter: (weeks: number) => void;
  sort: SortType;
  sortSetter: (sort: SortType) => void;
  capacitiesView: CapacitiesViewType;
  capacitiesViewSetter: (capacityView: CapacitiesViewType) => void;
  calendarView: CalendarViewType;
  calendarViewSetter: (calendarView: CalendarViewType) => void;
}

const nav = (
  url: string,
  token: string,
  t: TFunction,
  stateData: StateData
): NavDefinition => {
  return [
    {
      name: 'common',
      title: t('nav:tabs.common'),
      sections: [
        {
          header: t('nav:common.view.header'),
          items: [
            {
              type: 'largeIcon',
              onClick: () => stateData.viewSetter('calendar'),
              active: stateData.view === 'calendar',
              src: weeks,
              title: t('nav:common.view.calendar'),
            },
            {
              type: 'largeIcon',
              onClick: () => stateData.viewSetter('jobs'),
              active: stateData.view === 'jobs',
              src: viewIcon,
              title: t('nav:common.view.jobs'),
            },
          ],
        },
        {
          header: t('nav:common.forms.header'),
          items: [
            {
              type: 'largeIcon',
              onClick: () => {
                openWindow(GenerateDocumentPath, GenerateDocumentSettings);
              },
              src: generateDocument,
              title: t('nav:common.forms.generateDocument'),
            },
          ],
        },
        {
          header: t('nav:common.actions.header'),
          items: [
            {
              type: 'largeIcon',
              onClick: () =>
                callReloadPlates(url, token, () => {
                  showMessageBox(
                    'plates:reloaded',
                    MSGBOX_TYPE_SUCCESS,
                    MSGBOX_BUTTONS_OK
                  );
                }),
              src: '',
              title: t('nav:common.actions.reloadPlates'),
            },
          ],
        },
        {
          header: t('nav:common.settings.header'),
          items: [
            {
              type: 'largeIcon',
              onClick: () =>
                openWindow(
                  SettingsPath + '?url=' + url + '&token=' + token,
                  SettingsSettings
                ),
              src: settings,
              title: t('nav:common.settings.settings'),
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
              onClick: () => stateData.weeksSetter(4),
              active: stateData.weeks === 4,
              src: months,
              title: t('nav:calendarView.period.months'),
            },
            {
              type: 'largeIcon',
              onClick: () => stateData.weeksSetter(1),
              active: stateData.weeks === 1,
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
              onClick: () => stateData.sortSetter('earliest'),
              active: stateData.sort === 'earliest',
              src: deadlineEarliest,
              title: t('nav:calendarView.sort.deadlineEarliest'),
            },
            {
              type: 'largeIcon',
              onClick: () => stateData.sortSetter('latest'),
              active: stateData.sort === 'latest',
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
              onClick: () => stateData.capacitiesViewSetter('percentage'),
              active: stateData.capacitiesView === 'percentage',
              src: capacitiesPercentual,
              title: t('nav:calendarView.capacitiesView.percentual'),
            },
            {
              type: 'largeIcon',
              onClick: () => stateData.capacitiesViewSetter('absolute'),
              active: stateData.capacitiesView === 'absolute',
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
                stateData.calendarViewSetter('classicDays');
              },
              active: stateData.calendarView === 'classicDays',
              src: classicDays,
              title: t('nav:calendarView.phaseView.classicDays'),
            },
            {
              type: 'largeIcon',
              onClick: () => {
                stateData.calendarViewSetter('classicCapacities');
              },
              active: stateData.calendarView === 'classicCapacities',
              src: classicCapacities,
              title: t('nav:calendarView.phaseView.classicCapacities'),
            },
            {
              type: 'largeIcon',
              onClick: () => {
                stateData.calendarViewSetter('compact');
              },
              active: stateData.calendarView === 'compact',
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
                showMessageBox('Success message', 'success', ['ok']);
              },
              active: false,
              src: '',
              title: 'Success',
            },
            {
              type: 'largeIcon',
              onClick: () => {
                showMessageBox('Info message', 'info', ['ok']);
              },
              active: false,
              src: '',
              title: 'Info',
            },
            {
              type: 'largeIcon',
              onClick: () => {
                showMessageBox('Warning message', 'warning', ['ok', 'cancel']);
              },
              active: false,
              src: '',
              title: 'Warning',
            },
            {
              type: 'largeIcon',
              onClick: () => {
                showMessageBox('Error message', 'error', ['ok']);
              },
              active: false,
              src: '',
              title: 'Error',
            },
            {
              type: 'largeIcon',
              onClick: () => {
                showMessageBox('Question message', 'question', ['yes', 'no']);
              },
              active: false,
              src: '',
              title: 'Question',
            },
          ],
        },
      ],
    },
  ];
};

export default nav;
