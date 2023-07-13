import { Commands, CommandsKeys } from './formatByCommands/formatByCommands.types';
import { Currency } from '../constants';

export interface TemplateCommandsMap {
  [CommandsKeys.Plural]: Commands[CommandsKeys.Plural];
  [CommandsKeys.NumberType]: Commands[CommandsKeys.NumberType];
  [CommandsKeys.Unit]: Commands[CommandsKeys.Unit];
  [CommandsKeys.AttributeValue]: Commands[CommandsKeys.AttributeValue];
  [CommandsKeys.List]: Commands[CommandsKeys.List];
}

export interface StringTemplateData {
  currency?: Currency;
  [key: string]: unknown;
}
