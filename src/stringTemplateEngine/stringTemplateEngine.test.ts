import t from './stringTemplateEngine';
import formatByCommands from './formatByCommands';
import { StringTemplateData } from './stringTemplateEngine.types';

jest.mock('./formatByCommands/index', () => jest.fn((value) => value));
const mockFormatCommands = formatByCommands as jest.MockedFunction<typeof formatByCommands>;

describe('test string template engine', () => {
  describe('enter an arguments to braces', () => {
    test('one brace and argument', () => {
      const templateString = 'сумма {{amount}} очень большая';
      const templateData = { amount: 1 };
      const resultString = 'сумма 1 очень большая';

      expect(t(templateString, templateData)).toBe(resultString);
    });

    test('without arguments', () => {
      const templateString = 'сумма {{amount}} очень большая';
      const templateData = {};
      const resultString = 'сумма {{amount}} очень большая';

      expect(t(templateString, templateData)).toBe(resultString);
    });

    test('enter several arguments in braces', () => {
      const templateString = 'сумма {{amount}} под {{rate}} для данного продукта';
      const templateData = { amount: 1, rate: 2 };
      const resultString = 'сумма 1 под 2 для данного продукта';

      expect(t(templateString, templateData)).toBe(resultString);
    });

    test('enter same argument twice', () => {
      const templateString = 'сумма {{amount}} под {{amount}} для данного продукта';
      const templateData = { amount: 1, rate: 2 };
      const resultString = 'сумма 1 под 1 для данного продукта';

      expect(t(templateString, templateData)).toBe(resultString);
    });

    test.each([
      { templateData: { count: 0, amount: 1 }, resultString: '0 облигация без процентов под сумму 1' },
      { templateData: { count: '', amount: 1 }, resultString: ' облигация без процентов под сумму 1' },
      { templateData: { count: ' ', amount: 1 }, resultString: '  облигация без процентов под сумму 1' },
      { templateData: { count: null, amount: 1 }, resultString: '{{count}} облигация без процентов под сумму 1' },
    ])('format string and null values', ({ templateData, resultString }) => {
      const templateString = '{{count}} облигация без процентов под сумму {{amount}}';

      expect(t(templateString, templateData)).toBe(resultString);
    });

    test('variables in string with postfix', () => {
      const templateString = 'сумма {{amount}}RUB под {{rate}}% для данного продукта';
      const templateData = { amount: 1, rate: 2 };
      const resultString = 'сумма 1RUB под 2% для данного продукта';

      expect(t(templateString, templateData)).toBe(resultString);
    });

    test('merged variables', () => {
      const templateString = 'сумма {{amount}}{{currency}} под {{rate}}% для данного продукта';
      const templateData: StringTemplateData = { amount: 1, rate: 2, currency: 'RUB' };
      const resultString = 'сумма 1RUB под 2% для данного продукта';

      expect(t(templateString, templateData)).toBe(resultString);
    });
  });

  describe('test correct formatByCommands call', () => {
    beforeAll(() => {
      mockFormatCommands.mockClear();
    });

    afterEach(() => {
      mockFormatCommands.mockClear();
    });

    test('amount of calls with different values', () => {
      const templateString = 'сумма {{count}} под {{rate}}% для данного продукта';
      const templateData = { count: 0, rate: 1 };
      t(templateString, templateData);

      expect(mockFormatCommands).toHaveBeenCalledTimes(2);
    });

    test('amount of calls with different values in template data and with the same value in template string', () => {
      const templateString = 'сумма {{rate}} под {{rate}}% для данного продукта';
      const templateData = { count: 0, rate: 1 };
      t(templateString, templateData);

      expect(mockFormatCommands).toHaveBeenCalledTimes(1);
    });

    test('amount of calls with same template string variable but with different commands for variable', () => {
      const templateString = 'сумма {{rate;plural=месяц}} под {{rate}}% для данного продукта';
      const templateData = { count: 0, rate: 1 };
      t(templateString, templateData);

      expect(mockFormatCommands).toHaveBeenCalledTimes(2);
    });

    test('second argument with parsed commands', () => {
      const templateString =
        'сумма {{rate;numberType=currency}} под {{rate;numberType=term;plural=день}} для данного продукта {{rate;unit}}';
      const templateData = { count: 0, rate: 1 };
      t(templateString, templateData);

      expect(mockFormatCommands.mock.calls[0][1]).toHaveProperty('numberType', 'currency');

      expect(mockFormatCommands.mock.calls[1][1]).toHaveProperty('numberType', 'term');
      expect(mockFormatCommands.mock.calls[1][1]).toHaveProperty('plural', 'день');

      expect(mockFormatCommands.mock.calls[2][1]).toHaveProperty('unit', undefined);
    });

    test('provide currency from templateData', () => {
      const templateString = 'сумма {{rate;numberType=currency}}';
      const templateData: StringTemplateData = { currency: 'RUB', rate: 1 };
      t(templateString, templateData);

      expect(mockFormatCommands.mock.calls[0][2]).toHaveProperty('currency', 'RUB');
    });
  });
});
