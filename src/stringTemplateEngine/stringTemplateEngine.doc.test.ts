import t from './stringTemplateEngine';

describe('documentation tests string template engine', () => {
  test('documentation tests', () => {
    expect(t('количество {{amount;numberType=decimal}}', { amount: 1000000 })).toBe('количество 1 000 000');
    expect(t('сумма {{amount;numberType=currency}}', { amount: 1 })).toBe('сумма 1 ₽');
    expect(t('проценты {{rate;numberType=percent}}', { rate: 1.5 })).toBe('проценты 1,5%');
    expect(t('срок {{term;numberType=term,workDay}}', { term: 3 })).toBe('срок 3 рабочих дня');
    expect(t('срок {{term;plural=день}}', { term: 5 })).toBe('срок 5 дней');
    expect(t('{{term;plural=день;numberType=percent}}', { term: 5 })).toBe('5% дней');
    expect(
      t('обслуживание {{amount;unit}}', {
        amount: {
          value: 50,
          unit: { type: 'ratio', numerator: 'RUB', denominator: 'day' },
        },
      }),
    ).toBe('обслуживание 50 ₽/день');
    expect(
      t('ставка от {{rate;attributeValue=minValue}} до {{rate;attributeValue=maxValue;unit}}', {
        rate: {
          minValue: 1,
          maxValue: 50,
          unit: { type: 'percent' },
        },
      }),
    ).toBe('ставка от 1 до 50%');
    expect(
      t('{{values;unit;list=1}} или {{values;unit;list=2}}', {
        values: [
          {
            value: 1,
          },
          {
            value: 1.5,
          },
        ],
        unit: { type: 'percent' },
      }),
    ).toBe('1% или 1,5%');
    expect(
      t('{{values;unit;list=1}} или {{values;unit;list=2}}', {
        values: [1, 1.5],
        unit: { type: 'percent' },
      }),
    ).toBe('1% или 1,5%');
  });
});
