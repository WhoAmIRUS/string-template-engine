import PluralsDictionarySingleton from './PluralsDictionarySingleton';
import { PluralFormatFunction } from './pluralFormat.types';

export const getPluralForm = (numberValue: number, valueToPluralize: string): string | void => {
  // eslint-disable-next-line no-magic-numbers
  const cases = [2, 0, 1, 1, 1, 2];
  const pluralKey = PluralsDictionarySingleton.getInstance().pluralsDictionary[valueToPluralize];

  if (!pluralKey) {
    return;
  }

  /* eslint-disable no-magic-numbers */
  return pluralKey[
    numberValue % 100 > 4 && numberValue % 100 < 20 ? 2 : cases[numberValue % 10 < 5 ? numberValue % 10 : 5]
  ];
  /* eslint-enable */
};

const pluralizeWordAndAddToString = (number: number, word: string, string: string): string => {
  const pluralForm = getPluralForm(number, word);

  if (!pluralForm) {
    return `${string} ${word}`;
  }

  return `${string} ${pluralForm}`;
};

const pluralFormat: PluralFormatFunction = (value, pluralizeString, args) => {
  let result = `${value}`;

  if (Array.isArray(pluralizeString)) {
    pluralizeString.forEach((propsCommandValueItem) => {
      result = pluralizeWordAndAddToString(args?.initialValue ?? Number(value), propsCommandValueItem, result);
    });
  } else {
    result = pluralizeWordAndAddToString(args?.initialValue ?? Number(value), pluralizeString, result);
  }

  return result;
};

export default pluralFormat;
