import {
  AttributeValueFormatFunctionArguments,
  AttributeValueFormatFunctionValue,
} from './formatByAttributeValue.types';

function formatByAttributeValue(
  value: AttributeValueFormatFunctionValue,
  formatByArgumentValueArguments: AttributeValueFormatFunctionArguments,
): unknown {
  return value[formatByArgumentValueArguments];
}

export default formatByAttributeValue;
