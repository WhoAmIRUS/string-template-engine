import { PluralsDictionary } from './PluralsDictionarySingleton.types';
import PluralsDictionarySingleton from './index';

const loadPluralsDictionary = (pluralsDictionary: PluralsDictionary) => {
  PluralsDictionarySingleton.getInstance().loadPluralsDictionary(pluralsDictionary);
};

export default loadPluralsDictionary;
