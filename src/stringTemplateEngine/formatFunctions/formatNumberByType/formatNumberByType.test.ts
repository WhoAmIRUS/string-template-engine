import formatNumberByType from './index';
import { Currency, Term } from '../../../constants';

describe('test formatNumberByType', () => {
  test.each<{ type: 'decimal' | 'term' | 'percent'; result: string }>([
    { type: 'decimal', result: '6,48' },
    { type: 'term', result: '6,48 дней' },
    { type: 'percent', result: '6,48%' },
  ])('format values as decimal', ({ type, result }) => {
    expect(formatNumberByType(6.48, { type })).toBe(result);
  });

  test.each<{ type: 'decimal' | 'currency' | 'percent'; result: string }>([
    { type: 'decimal', result: '1 000 000' },
    { type: 'currency', result: '1 000 000 ₽' },
    { type: 'percent', result: '1 000 000%' },
  ])('format separator between digits', ({ type, result }) => {
    expect(formatNumberByType(1000000, { type })).toBe(result);
  });

  test.each<{ currency?: Currency; result: string }>([
    { currency: undefined, result: '1 ₽' },
    { currency: 'RUB', result: '1 ₽' },
    { currency: 'USD', result: '1 $' },
  ])('format currency value with different args', ({ currency, result }) => {
    expect(formatNumberByType(1, { type: 'currency', value: currency })).toBe(result);
  });

  test('format percent value', () => {
    expect(formatNumberByType(12.3, { type: 'percent' })).toBe('12,3%');
  });

  test.each([
    { value: 6.5, result: '6,5 дней' },
    { value: 180, result: '180 дней' },
    { value: 380, result: '1 год' },
    { value: 729, result: '1 год' },
    { value: 730, result: '2 года' },
  ])('format term without fixed value', ({ value, result }) => {
    expect(formatNumberByType(value, { type: 'term' })).toBe(result);
  });

  test.each<{ currency: Currency; result: string }>([
    { currency: 'RUB', result: '123 ₽' },
    { currency: 'USD', result: '123 $' },
  ])('format currency with fixed value', ({ currency, result }) => {
    expect(formatNumberByType(123, { type: 'currency', value: currency })).toBe(result);
  });

  test.each<{ term: Term; result: string }>([
    { term: 'day', result: '180 дней' },
    { term: 'month', result: '180 месяцев' },
    { term: 'year', result: '180 лет' },
    { term: 'workDay', result: '180 рабочих дней' },
    { term: 'calendarDay', result: '180 календарных дней' },
  ])('format term with fixed value', ({ term, result }) => {
    expect(formatNumberByType(180, { type: 'term', value: term })).toBe(result);
  });

  describe('format ratio value', () => {
    test('without fixed numerator currency value', () => {
      expect(formatNumberByType(11, { type: 'ratio', numerator: 'currency', denominator: 'day' })).toBe('11 ₽/день');
      expect(
        formatNumberByType(11, { type: 'ratio', numerator: 'currency', denominator: 'day' }, { currency: 'USD' }),
      ).toBe('11 $/день');
    });
    test('with fixed numerator currency value', () => {
      expect(formatNumberByType(11, { type: 'ratio', numerator: 'RUB', denominator: 'day' })).toBe('11 ₽/день');
      expect(formatNumberByType(11, { type: 'ratio', numerator: 'USD', denominator: 'day' }, { currency: 'RUB' })).toBe(
        '11 $/день',
      );
    });
  });
});
