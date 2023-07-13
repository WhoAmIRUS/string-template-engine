import { Currency, Term } from '../../../constants';

export interface FormatByUnitArguments {
  unit: Unit;
}

export type FormatByUnitValue = number | UnitFormatFunctionData;

export interface UnitFormatFunctionData {
  value: number;
  unit: Unit;
}

export interface FormatByUnitCommonArguments {
  currency?: Currency;
}

export type UnitFormatFunction = (
  value: FormatByUnitValue,
  formatByUnitArguments: FormatByUnitArguments,
  commonArguments?: FormatByUnitCommonArguments,
) => string;

export type Unit = UnitTerm | UnitCurrency | UnitPercent | UnitRatio;

export interface UnitTerm {
  type: 'term';
  value?: Term;
}

export interface UnitCurrency {
  type: 'currency';
  value?: Currency;
}

export interface UnitPercent {
  type: 'percent';
}

export interface UnitRatio {
  type: 'ratio';
  numerator: 'currency' | Currency;
  denominator: Term;
}
