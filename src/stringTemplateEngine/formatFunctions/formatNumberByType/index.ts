import { DAYS_IN_YEAR, Term } from '../../../constants';
import pluralFormat from '../pluralFormat';
import { DefaultValues, FormatNumberByTypeArguments, NumberTypeFormatFunction } from './formatNumberByType.types';
import { PluralValue } from '../pluralFormat/pluralFormat.types';

const TERM_FORMAT_MIN_CONVERT_VALUE = DAYS_IN_YEAR;

export const TERM_BY_PLURALS: Record<Term, PluralValue> = {
  day: 'день',
  month: 'месяц',
  year: 'год',
  workDay: ['рабочий', 'день'],
  calendarDay: ['календарный', 'день'],
};

export const TERM_TRANSLATE: Record<Term, string> = {
  day: 'день',
  month: 'месяц',
  year: 'год',
  workDay: 'рабочий день',
  calendarDay: 'календарный день',
};

const formatTermNumber = (formattedValue: string, term: Term | null, initialValue: number): string => {
  let termUnit: Term = term ?? 'day';
  let termValue: number = initialValue;
  let termFormattedValue: string | number = formattedValue;

  if (term === null) {
    if (termValue >= TERM_FORMAT_MIN_CONVERT_VALUE) {
      termValue = Math.floor(termValue / DAYS_IN_YEAR);
      termFormattedValue = termValue;
      termUnit = 'year';
    }
  }

  const pluralizedTermUnit: string =
    pluralFormat(termFormattedValue, TERM_BY_PLURALS[termUnit], { initialValue: termValue }) ?? termUnit;

  return `${pluralizedTermUnit}`;
};

const setOptions = (args: FormatNumberByTypeArguments, defaultValues: DefaultValues): Intl.NumberFormatOptions => {
  const { type } = args;

  const options: Intl.NumberFormatOptions = {
    maximumFractionDigits: 2,
    style: 'decimal',
    minimumFractionDigits: 0,
  };

  if (type === 'currency') {
    options.currency = args.value || defaultValues.currency;
    options.style = 'currency';
  }

  if (type === 'ratio') {
    if (args.numerator === 'currency' || args.numerator === 'RUB' || args.numerator === 'USD') {
      options.currency = args.numerator === 'currency' ? defaultValues.currency : args.numerator;
      options.style = 'currency';
    }
  }

  return options;
};

const postFormattingProcess = (
  formattedValue: string,
  args: FormatNumberByTypeArguments,
  initialValue: number,
): string => {
  const { type } = args;

  if (type === 'ratio') {
    return `${formattedValue}/${TERM_TRANSLATE[args.denominator]}`;
  }

  if (type === 'percent') {
    return `${formattedValue}%`;
  }

  if (type === 'term') {
    return formatTermNumber(formattedValue, args.value ?? null, initialValue);
  }

  return formattedValue;
};

const formatNumberByType: NumberTypeFormatFunction = (value, numberByTypeArguments, commonArguments) => {
  const defaultValues: DefaultValues = { currency: commonArguments?.currency ?? 'RUB' };

  const options = setOptions(numberByTypeArguments, defaultValues);
  let formattedValue = new Intl.NumberFormat('ru-RU', options).format(value);
  formattedValue = postFormattingProcess(formattedValue, numberByTypeArguments, value);

  return formattedValue;
};

export default formatNumberByType;
