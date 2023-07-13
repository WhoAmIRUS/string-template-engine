import { Commands } from './formatByCommands.types';
import formatNumberByType from '../formatFunctions/formatNumberByType';
import pluralFormat from '../formatFunctions/pluralFormat';
import formatByCommands from './index';
import { getCallOrder } from '../../utils';
import formatByUnit from '../formatFunctions/formatByUnit';
import formatByAttributeValue from '../formatFunctions/formatByAttributeValue';

jest.mock('../formatFunctions/formatNumberByType/index.ts');
jest.mock('../formatFunctions/pluralFormat/index.ts');
jest.mock('../formatFunctions/formatByUnit/index.ts');
jest.mock('../formatFunctions/formatByAttributeValue/index.ts');

const mockFormatNumberByType = formatNumberByType as jest.MockedFunction<typeof formatNumberByType>;
const mockPluralFormat = pluralFormat as jest.MockedFunction<typeof pluralFormat>;
const mockFormatByUnit = formatByUnit as jest.MockedFunction<typeof formatByUnit>;
const mockFormatByAttributeValue = formatByAttributeValue as jest.MockedFunction<typeof formatByAttributeValue>;

enum CallFunctionNames {
  FormatNumberByType = 'formatNumberByType',
  PluralFormat = 'pluralFormat',
  FormatByUnit = 'formatByUnit',
  FormatByAttributeValue = 'formatByAttributeValue',
}

const setupCallOrder = () => {
  const { callOrder, functionDecorator } = getCallOrder();

  mockFormatByUnit.mockImplementation(
    functionDecorator(CallFunctionNames.FormatByUnit, (value: unknown) => `${value} раз/день`),
  );
  mockPluralFormat.mockImplementation(
    functionDecorator(CallFunctionNames.PluralFormat, (value: unknown) => `${value} день`),
  );
  mockFormatNumberByType.mockImplementation(
    functionDecorator(CallFunctionNames.FormatNumberByType, (value: unknown) => `${value} %`),
  );
  mockFormatByAttributeValue.mockImplementation(
    functionDecorator(CallFunctionNames.FormatByAttributeValue, (value: unknown) => value),
  );

  return callOrder;
};

describe('test formatByCommands with mocked functions', () => {
  afterEach(() => {
    mockFormatNumberByType.mockClear();
    mockPluralFormat.mockClear();
    mockFormatByUnit.mockClear();
    mockFormatByAttributeValue.mockClear();
  });

  test.each<{ commands: Commands; functions: jest.MockedFunction<any>[] }>([
    {
      commands: { plural: 'цена', numberType: 'currency', attributeValue: 'value' },
      functions: [mockFormatNumberByType, mockPluralFormat, mockFormatByAttributeValue],
    },
    {
      commands: { plural: 'цена', unit: undefined, attributeValue: 'value' },
      functions: [mockFormatByUnit, mockPluralFormat, mockFormatByAttributeValue],
    },
  ])('call functions by commands', ({ commands, functions }) => {
    formatByCommands(123, commands);

    functions.forEach((functionsItem) => {
      expect(functionsItem).toHaveBeenCalled();
    });
  });

  test('order function call with unit command', () => {
    const callOrder = setupCallOrder();

    formatByCommands(123, { attributeValue: 'minValue', unit: undefined, plural: 'день' });

    expect(callOrder[0]).toBe(CallFunctionNames.FormatByAttributeValue);
    expect(callOrder[1]).toBe(CallFunctionNames.FormatByUnit);
    expect(callOrder[2]).toBe(CallFunctionNames.PluralFormat);
  });

  test('order function call with numberType command', () => {
    const callOrder = setupCallOrder();

    formatByCommands(123, { numberType: 'currency', plural: 'день', attributeValue: 'minValue' });

    expect(callOrder[0]).toBe(CallFunctionNames.FormatByAttributeValue);
    expect(callOrder[1]).toBe(CallFunctionNames.FormatNumberByType);
    expect(callOrder[2]).toBe(CallFunctionNames.PluralFormat);
  });
});
