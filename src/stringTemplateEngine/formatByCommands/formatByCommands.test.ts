import { Commands, FormatArguments } from './formatByCommands.types';
import formatByCommands from './index';

describe('test formatByCommands', () => {
  test.each<{ commands: Commands; result: string; value: unknown; data?: FormatArguments }>([
    // 1 команда
    { commands: { attributeValue: 'minValue' }, result: 'бесплатно', value: { minValue: 'бесплатно' } },
    { commands: { unit: undefined }, result: '123%', value: { value: 123, unit: { type: 'percent' } } },
    { commands: { numberType: 'currency' }, result: '123 $', value: 123 },
    { commands: { plural: 'день' }, result: '123 дня', value: 123 },
    { commands: { list: 2 }, result: '321', value: [123, 321] },
    // 2 команды
    { commands: { attributeValue: 'minValue', plural: 'день' }, result: '123 дня', value: { minValue: 123 } },
    {
      commands: { attributeValue: 'minValue', unit: undefined },
      result: '123%',
      value: { minValue: 123, unit: { type: 'percent' } },
    },
    { commands: { attributeValue: 'minValue', numberType: 'currency' }, result: '123 $', value: { minValue: 123 } },
    { commands: { attributeValue: 'minValue', list: 2 }, result: '321', value: [{ minValue: 123 }, { minValue: 321 }] },
    {
      commands: { unit: undefined, numberType: 'currency' },
      result: '123%',
      value: { value: 123, unit: { type: 'percent' } },
    },
    {
      commands: { unit: undefined, list: 2 },
      result: '321%',
      value: [123, 321],
      data: { unit: { type: 'percent' } },
    },
    {
      commands: { unit: undefined, plural: 'день' },
      result: '123% дня',
      value: 123,
      data: { unit: { type: 'percent' } },
    },
    { commands: { numberType: 'currency', plural: 'день' }, result: '123 $ дня', value: 123 },
    { commands: { numberType: 'currency', list: 2 }, result: '321 $', value: [123, 321] },
    { commands: { plural: 'день', list: 2 }, result: '321 день', value: [123, 321] },
    // 3 команды
    {
      commands: { attributeValue: 'minValue', unit: undefined, plural: 'день' },
      result: '123% дня',
      value: { minValue: 123, unit: { type: 'percent' } },
    },
    {
      commands: { list: 2, unit: undefined, plural: 'день' },
      result: '321% день',
      value: [123, 321],
      data: { unit: { type: 'percent' } },
    },
    {
      commands: { attributeValue: 'minValue', list: 2, plural: 'день' },
      result: '321 день',
      value: [{ minValue: 123 }, { minValue: 321 }],
    },
    {
      commands: { attributeValue: 'minValue', unit: undefined, list: 2 },
      result: '321 $',
      value: [
        { minValue: 123, unit: { type: 'percent' } },
        { minValue: 321, unit: { type: 'currency' } },
      ],
    },
    {
      commands: { numberType: 'currency', plural: 'день', attributeValue: 'minValue' },
      result: '123 $ дня',
      value: { minValue: 123 },
    },
    {
      commands: { numberType: 'currency', list: 2, attributeValue: 'minValue' },
      result: '321 $',
      value: [{ minValue: 123 }, { minValue: 321 }],
    },
    {
      commands: { numberType: 'currency', plural: 'день', list: 2 },
      result: '321 $ день',
      value: [123, 321],
    },
    // 4 команды
    {
      commands: { attributeValue: 'minValue', numberType: 'currency', plural: 'день', list: 2 },
      result: '321 ₽ день',
      value: [
        { minValue: 123, currency: 'RUB' },
        { minValue: 321, currency: 'RUB' },
      ],
    },
    {
      commands: { attributeValue: 'minValue', list: 2, unit: undefined, plural: 'день' },
      result: '321 $ день',
      value: [
        { minValue: 123, unit: { type: 'percent' } },
        { minValue: 321, unit: { type: 'currency' } },
      ],
    },
  ])('test different commands combinations', ({ commands, result, value, data }) => {
    expect(formatByCommands(value, commands, { currency: 'USD', ...data })).toBe(result);
  });

  test.each([
    { value: 'одна', result: 'одна' },
    { value: 123, result: '123' },
  ])('no commands test', ({ value, result }) => {
    expect(formatByCommands(value, {} as Commands)).toBe(result);
  });

  test.each<{ commands: Commands; value: unknown; data: FormatArguments; result: string }>([
    {
      commands: { list: 2, unit: undefined },
      value: [
        { value: 123, unit: { type: 'currency', value: 'USD' } },
        { value: 321, unit: { type: 'currency', value: 'USD' } },
      ],
      data: { unit: { type: 'currency', value: 'RUB' } },
      result: '321 $',
    },
    {
      commands: { unit: undefined },
      value: { value: 123, unit: { type: 'currency', value: 'USD' } },
      data: { unit: { type: 'percent' } },
      result: '123 $',
    },
    {
      commands: { list: 2, unit: undefined },
      value: [{ value: 123 }, { value: 321 }],
      data: { unit: { type: 'percent' } },
      result: '321%',
    },
  ])('redeclare external args by the formattingValueData', ({ value, commands, data, result }) => {
    expect(formatByCommands(value, commands, data)).toBe(result);
  });
});
