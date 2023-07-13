import { PluralsDictionary } from './PluralsDictionarySingleton.types';
import plurals from './plurals';

class PluralsDictionarySingleton {
  public pluralsDictionary: PluralsDictionary;

  private static instance: PluralsDictionarySingleton;

  private constructor() {
    this.pluralsDictionary = plurals;
  }

  public static getInstance() {
    if (!PluralsDictionarySingleton.instance) {
      PluralsDictionarySingleton.instance = new PluralsDictionarySingleton();
    }

    return PluralsDictionarySingleton.instance;
  }

  public loadPluralsDictionary(loadablePluralsDictionary: PluralsDictionary): void {
    this.pluralsDictionary = {
      ...plurals,
      ...loadablePluralsDictionary,
    };
  }
}

export default PluralsDictionarySingleton;
