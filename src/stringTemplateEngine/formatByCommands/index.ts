import { Commands, CommandsDataValue, CommandsKeys, FormatArguments } from './formatByCommands.types';
import formatByUnit from '../formatFunctions/formatByUnit';
import formatByAttributeValue from '../formatFunctions/formatByAttributeValue';
import { FormatByUnitValue, UnitFormatFunctionData } from '../formatFunctions/formatByUnit/formatByUnit.types';
import { AttributeValueFormatFunctionValue } from '../formatFunctions/formatByAttributeValue/formatByAttributeValue.types';
import formatNumberByType from '../formatFunctions/formatNumberByType';
import {
  CurrencyArguments,
  FormatNumberByTypeArguments,
  RatioArguments,
  TermArguments,
} from '../formatFunctions/formatNumberByType/formatNumberByType.types';
import pluralFormat from '../formatFunctions/pluralFormat';
import { isObject } from '../../utils';

function initializeDataForFormatting(value: unknown, args?: FormatArguments): CommandsDataValue | null {
  let dataValue: CommandsDataValue | null = null;

  if (isObject(args)) {
    dataValue = { ...args };
  }

  if (isObject(value)) {
    dataValue = { ...dataValue, ...value };
  }

  return dataValue;
}

function formatByCommands(value: unknown, commands: Commands, args?: FormatArguments): string {
  let formattingValue: unknown = value;
  let dataForFormatting = initializeDataForFormatting(value, args);
  let result: string = `${formattingValue}`;

  if (CommandsKeys.List in commands) {
    const valueListIndex = Number(commands[CommandsKeys.List]!) - 1;
    const listFormattingValue: Array<unknown> = formattingValue as Array<unknown>;
    const listValue = listFormattingValue[valueListIndex];

    if (isObject(listValue)) {
      dataForFormatting = { ...dataForFormatting, ...listValue };
    }

    formattingValue = listFormattingValue[valueListIndex];
    result = `${formattingValue}`;
  }

  if (CommandsKeys.AttributeValue in commands) {
    const valueName = commands[CommandsKeys.AttributeValue]!;
    formattingValue = formatByAttributeValue(formattingValue as AttributeValueFormatFunctionValue, valueName);
    result = `${formattingValue}`;
  }

  if (CommandsKeys.Unit in commands) {
    result = formatByUnit(
      formattingValue as FormatByUnitValue,
      { unit: (dataForFormatting as unknown as UnitFormatFunctionData)?.unit },
      dataForFormatting || undefined,
    );
  } else if (CommandsKeys.NumberType in commands) {
    const commandValue = commands[CommandsKeys.NumberType]!;
    const type = Array.isArray(commandValue) ? commandValue[0] : commandValue;
    let numberByTypeArguments: FormatNumberByTypeArguments | null = null;

    switch (type) {
      case 'term':
        numberByTypeArguments = {
          type: 'term',
          value: Array.isArray(commandValue) ? commandValue[1] : undefined,
        } as TermArguments;
        break;
      case 'currency':
        numberByTypeArguments = {
          type: 'currency',
          value: Array.isArray(commandValue) ? commandValue[1] : undefined,
        } as CurrencyArguments;
        break;
      case 'ratio':
        numberByTypeArguments = {
          type: 'ratio',
          numerator: commandValue[1],
          // eslint-disable-next-line no-magic-numbers
          denominator: commandValue[2],
        } as RatioArguments;
        break;
      default:
        numberByTypeArguments = { type };
    }

    result = formatNumberByType(formattingValue as number, numberByTypeArguments!, dataForFormatting || undefined);
  }

  if (CommandsKeys.Plural in commands) {
    result = pluralFormat(result as string | number, commands[CommandsKeys.Plural]!, {
      initialValue: formattingValue as number,
    });
  }

  return result;
}

export default formatByCommands;
