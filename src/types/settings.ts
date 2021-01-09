export interface SettingsType {
  currentNav: NavType;
  view: string;
  calendarView: CalendarViewType;
  capacitiesView: CapacitiesViewType;
  sort: SortType;
  weeks: number;
  pambaPath: string;
  url: string;
}

export type NavType = 'home' | 'material' | 'calendarView' | 'jobsView';

export type CalendarViewType = 'classicDays' | 'classicCapacities' | 'compact';

export type CapacitiesViewType = 'percentage' | 'absolute';

export type SortType = 'earliest' | 'latest';

export interface SettingsCategory {
  name: string;
  icon: any;
  component: any;
}
