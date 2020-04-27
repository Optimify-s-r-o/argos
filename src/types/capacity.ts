export interface CapacityType {
  date: string;
  saw: CapacityQuantityType;
  press: CapacityQuantityType;
  construction: CapacityQuantityType;
}

export interface CapacityQuantityType {
  available: number;
  used: number;
}

export type CapacityMoveMethod =
  | 'moveAllCapacity'
  | 'moveCapacityToFill'
  | 'moveCapacity';
