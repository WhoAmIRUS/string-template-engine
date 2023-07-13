import { PluralValue } from '../formatFunctions/pluralFormat/pluralFormat.types';
import {
  FormatNumberByTypeCommonArguments,
  NumberTypesKeyPicker,
} from '../formatFunctions/formatNumberByType/formatNumberByType.types';
import { FormatByUnitArguments } from '../formatFunctions/formatByUnit/formatByUnit.types';
import { AttributeValueFormatFunctionArguments } from '../formatFunctions/formatByAttributeValue/formatByAttributeValue.types';
import { Currency, Term } from '../../constants';

export enum CommandsKeys {
  Plural = 'plural',
  NumberType = 'numberType',
  Unit = 'unit',
  AttributeValue = 'attributeValue',
  List = 'list',
}

type FormatNumberByTypeArguments =
  | NumberTypesKeyPicker<'decimal'>
  | NumberTypesKeyPicker<'percent'>
  | NumberTypesKeyPicker<'currency'>
  | NumberTypesKeyPicker<'term'>
  | [NumberTypesKeyPicker<'currency'>, Currency]
  | [NumberTypesKeyPicker<'ratio'>, 'currency' | Currency, Term]
  | [NumberTypesKeyPicker<'term'>, Term];

export interface Commands {
  [CommandsKeys.Plural]?: PluralValue;
  [CommandsKeys.NumberType]?: FormatNumberByTypeArguments;
  [CommandsKeys.Unit]?: FormatByUnitArguments;
  [CommandsKeys.AttributeValue]?: AttributeValueFormatFunctionArguments;
  [CommandsKeys.List]?: number;
}

export type FormatArguments = FormatNumberByTypeCommonArguments & {
  [key: string]: unknown;
};

export type CommandsDataValue = {
  [key: string]: unknown;
};
