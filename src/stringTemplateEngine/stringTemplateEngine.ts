import { isNullable, replaceAll } from '../utils';
import { TemplateCommandsMap, StringTemplateData } from './stringTemplateEngine.types';
import formatByCommands from './formatByCommands';

const OPEN_BRACES = '{{';
const CLOSE_BRACES = '}}';
const TEMPLATE_COMMAND_KEY_VALUE_DELIMITER = '=';
const TEMPLATE_COMMANDS_DELIMITER = ';';
const TEMPLATE_COMMAND_ARGUMENTS_DELIMITER = ',';

function parsTemplateCommands(templateCommands: string[]) {
  const templateCommandsMap: TemplateCommandsMap = templateCommands.reduce((accumulator, currentCommand) => {
    const [commandName, commandValue] = currentCommand.split(TEMPLATE_COMMAND_KEY_VALUE_DELIMITER);
    const commandArguments = commandValue ? commandValue.split(TEMPLATE_COMMAND_ARGUMENTS_DELIMITER) : [];

    if (commandArguments.length > 1) {
      // @ts-ignore
      accumulator[commandName] = commandArguments;
    } else {
      // @ts-ignore
      accumulator[commandName] = commandValue;
    }

    return accumulator;
  }, {} as TemplateCommandsMap);

  return templateCommandsMap;
}

function t<T extends object>(templateString: string, data: T) {
  const templateStringVariables = templateString.match(new RegExp(`${OPEN_BRACES}.*?${CLOSE_BRACES}`, 'g'));
  const templateData: StringTemplateData = data as StringTemplateData;

  if (templateStringVariables === null) {
    return templateString;
  }

  const templateStringVariablesMappedByTemplateData: { [key: string]: string } = {};

  templateStringVariables.forEach((templateStringVariable: string) => {
    const templateStringVariableWithoutBrackets = templateStringVariable
      .replace(OPEN_BRACES, '')
      .replace(CLOSE_BRACES, '');
    const [templateDataKey, ...propsCommands]: string[] =
      templateStringVariableWithoutBrackets.split(TEMPLATE_COMMANDS_DELIMITER);

    if (templateStringVariablesMappedByTemplateData[templateStringVariable]) {
      return;
    }

    templateStringVariablesMappedByTemplateData[templateStringVariable] = !isNullable(templateData[templateDataKey])
      ? formatByCommands(templateData[templateDataKey], parsTemplateCommands(propsCommands), templateData)
      : templateStringVariable;
  });

  const resultString = Object.entries(templateStringVariablesMappedByTemplateData).reduce(
    (acc, [key, value]) => replaceAll(acc, key, value),
    templateString,
  );

  return resultString;
}

export default t;
