import { CapacitiesType, JobsType, WarningsType } from './calendar';
import { SettingsType } from './settings';

export interface StateType {
  token: string | null;
  settings: SettingsType;
  weekDelta: number;
  days: any;
  capacities: CapacitiesType;
  warnings: WarningsType;
  jobs: JobsType;
}
