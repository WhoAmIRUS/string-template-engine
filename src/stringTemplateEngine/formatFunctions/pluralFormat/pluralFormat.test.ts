import pluralFormat from './index';

describe('test pluralFormat', () => {
  test.each([
    { value: 1, pluralizedCommandValue: 'месяц' },
    { value: 2, pluralizedCommandValue: 'месяца' },
    { value: 5, pluralizedCommandValue: 'месяцев' },
  ])('plural one value', ({ value, pluralizedCommandValue }) => {
    expect(pluralFormat(value, 'месяц', { initialValue: value })).toBe(`${value} ${pluralizedCommandValue}`);
  });

  test.each([
    { value: 1, pluralizedCommandValue: 'рабочий день' },
    { value: 2, pluralizedCommandValue: 'рабочих дня' },
    { value: 5, pluralizedCommandValue: 'рабочих дней' },
  ])('pluralize several words', ({ value, pluralizedCommandValue }) => {
    expect(pluralFormat(value, ['рабочий', 'день'], { initialValue: value })).toBe(
      `${value} ${pluralizedCommandValue}`,
    );
  });

  test('test value that not in plurals dictionary', () => {
    const value = 2;
    const pluralizeString = 'машина';

    expect(pluralFormat(value, pluralizeString, { initialValue: value })).toBe(`${value} ${pluralizeString}`);
  });
});
