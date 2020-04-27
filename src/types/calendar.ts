import { JobType } from './job';

export type WarningsType = Array<any>;

export type CapacitiesType = Array<CapacitiesType>;

export type JobsType = Array<JobType>;

export interface CalendarDataType {
  warnings: WarningsType;
  capacities: CapacitiesType;
  jobs: JobsType;
}
