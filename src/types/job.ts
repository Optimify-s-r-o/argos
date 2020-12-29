export interface JobType {
  id: string;
  identification: string;
  state: JobStateType;
  place: string;
  type: string;
  deadline: string;
  contractStart: string;
  contractEnd: string;
  phases: PhasesType;
  warnings: Array<WarningType>;
}

export type JobStateType = 'Created' | 'Verified' | 'Finished' | 'InArchive';

export enum JobStateEnum {
  Created = 'Created',
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
  address: string;
  name: string;
  type: string;
};
