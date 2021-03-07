import { SortOptions } from '../components/table';

export interface JobType {
  name: string;
  id: string;
  state: JobStateType;
  city: string;
  type: string;
  deadline: string;
  contractStart: string;
  contractEnd: string;
  phases: PhasesType;
  warnings: Array<WarningType>;
}

export type JobStateType = 'Quotation' | 'Verified' | 'Finished' | 'InArchive';

export enum JobStateEnum {
  Quotation = 'Quotation',
  Verified = 'Verified',
  Finished = 'Finished',
  InArchive = 'InArchive',
}

export interface PhasesType {
  saw: Array<PhaseType>;
  press: Array<PhaseType>;
  transport: Array<PhaseType>;
  construction: Array<PhaseType>;
}

export interface PhaseType {
  id: string;
  date: string;
  consumption: number;
  phaseType: PhaseTypeType;
}

export type PhaseTypeType = 'Saw' | 'Press' | 'Transport' | 'Construction';

export enum PhaseTypeEnum {
  Saw = 'Saw',
  Press = 'Press',
  Transport = 'Transport',
  Construction = 'Construction',
}

export type WarningType = '';

export type LoadedJobType = {
  name: string;
  address: string;
  type: string;
  trusses: Array<any>;
  customer: string;
  deadline: string;
  contractStart: string;
  contractEnd: string;
};

export type JobSort = Array<JobSortProps>;

interface JobSortProps {
  column: 'name' | 'created' | 'begin' | 'end';
  direction: SortOptions;
}
