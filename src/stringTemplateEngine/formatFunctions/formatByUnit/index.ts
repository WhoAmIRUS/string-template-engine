import { UnitFormatFunction } from './formatByUnit.types';
import { FormatNumberByTypeArguments } from '../formatNumberByType/formatNumberByType.types';
import formatNumberByType from '../formatNumberByType';

const formatByUnit: UnitFormatFunction = (data, formatByUnitArguments, args): string => {
  let value: number | null = null;
  const { unit } = formatByUnitArguments;

  if (typeof data === 'object' && data !== null) {
    value = data.value;
  } else {
    value = data;
  }

  switch (unit.type) {
    case 'term': {
      const numberByTypeArguments: FormatNumberByTypeArguments = { type: 'term', value: unit.value };
      return formatNumberByType(value, numberByTypeArguments, args);
    }
    case 'currency': {
      const numberByTypeArguments: FormatNumberByTypeArguments = { type: 'currency', value: unit.value };
      return formatNumberByType(value, numberByTypeArguments, args);
    }
    case 'ratio': {
      const numberByTypeArguments: FormatNumberByTypeArguments = {
        type: 'ratio',
        numerator: unit.numerator,
        denominator: unit.denominator,
      };
      return formatNumberByType(value, numberByTypeArguments, args);
    }
    case 'percent': {
      return formatNumberByType(value, { type: 'percent' }, args);
    }
    default:
      return `${value}`;
  }
};

export default formatByUnit;
