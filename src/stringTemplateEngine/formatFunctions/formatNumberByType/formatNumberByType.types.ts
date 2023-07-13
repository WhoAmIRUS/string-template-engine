import { Currency, Term } from '../../../constants';

export interface FormatNumberByTypeCommonArguments {
  currency?: Currency;
}

export type NumberTypes = 'decimal' | 'currency' | 'percent' | 'term' | 'ratio';

export type NumberTypesKeyPicker<T extends NumberTypes> = T;

export interface DecimalArguments {
  type: NumberTypesKeyPicker<'decimal'>;
}

export interface PercentArguments {
  type: NumberTypesKeyPicker<'percent'>;
}

export interface CurrencyArguments {
  type: NumberTypesKeyPicker<'currency'>;
  value?: Currency;
}

export interface TermArguments {
  type: NumberTypesKeyPicker<'term'>;
  value?: Term;
}

export interface RatioArguments {
  type: NumberTypesKeyPicker<'ratio'>;
  numerator: 'currency' | Currency;
  denominator: Term;
}

export type FormatNumberByTypeArguments =
  | DecimalArguments
  | PercentArguments
  | CurrencyArguments
  | TermArguments
  | RatioArguments;

export type NumberTypeFormatFunction = (
  value: number,
  numberByTypeArguments: FormatNumberByTypeArguments,
  commonArguments?: FormatNumberByTypeCommonArguments,
) => string;

export interface DefaultValues {
  currency: Currency;
}
