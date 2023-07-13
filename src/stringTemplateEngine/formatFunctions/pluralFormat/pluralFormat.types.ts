export interface PluralFormatArguments {
  initialValue?: number;
}

export type PluralValue = string | string[];
export type PluralFormatFunction = (
  value: string | number,
  pluralizeString: PluralValue,
  args?: PluralFormatArguments,
) => string;
