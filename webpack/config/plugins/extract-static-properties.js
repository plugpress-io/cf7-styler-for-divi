/* eslint-disable no-undefined -- undefined value is needed for JSON creation and AST exploring to be done correctly */
/* eslint-disable no-use-before-define -- function declarations are hoisted so it allows for cross calling functions */
const { reduce, map, isUndefined, filter } = require('lodash');

/**
 * Recursively extract static properties from an AST array.
 * It considers Literals (String, Boolean, etc.), ObjectExpressions, ArrayExpressions, CallExpression, and Identifiers.
 *
 * @param {Array} properties The AST properties to extract data from.
 * @returns {object} The extracted static properties.
 */
module.exports = function extractStaticProperties(properties) {
  function firstDefined(values) {
    return values.find(val => val !== undefined);
  }

  function extractLiteralValue(element) {
    const validLiteralTypes = [
      'StringLiteral',
      'NumericLiteral',
      'BooleanLiteral',
      'NullLiteral',
      'Literal',
    ];
    const isLiteral = validLiteralTypes.includes(element.type);
    return isLiteral ? element.value : undefined;
  }

  function extractObjectProperties(element) {
    const isObjectExpression = element.type === 'ObjectExpression';
    return isObjectExpression ? extractStaticProperties(element.properties) : undefined;
  }

  function extractArrayValues(element) {
    const isArrayExpression = element.type === 'ArrayExpression';
    return isArrayExpression ? extractArrayElements(element.elements) : undefined;
  }

  function extractTranslationValue(element) {
    const isTranslationCall = element.type === 'CallExpression' && element.callee?.name === '__';
    if (isTranslationCall) {
      const firstArg = element.arguments[0];
      return firstArg?.type === 'StringLiteral' ? firstArg.value : undefined;
    }
    return undefined;
  }

  function extractIdentifierValue(element) {
    const isIdentifier = element.type === 'Identifier';
    return isIdentifier ? element.name : undefined;
  }

  function extractArrayElements(elements) {
    const extractedElements = map(elements, element => {
      const possibleValues = [
        extractLiteralValue(element),
        extractObjectProperties(element),
        extractArrayValues(element),
        extractTranslationValue(element),
        extractIdentifierValue(element),
      ];
      return firstDefined(possibleValues);
    });
    return filter(extractedElements, val => val !== undefined);
  }

  function extractValue(value) {
    const possibleValues = [
      extractLiteralValue(value),
      extractObjectProperties(value),
      extractArrayValues(value),
      extractTranslationValue(value),
      extractIdentifierValue(value),
    ];
    return firstDefined(possibleValues);
  }

  const staticProperties = reduce(properties, (acc, prop) => {
    const key = prop?.key?.type === 'Identifier' ? prop?.key?.name : prop?.key?.value;
    if (isUndefined(key)) {
      return acc;
    }
    const extractedValue = extractValue(prop.value);
    return isUndefined(extractedValue) ? acc : { ...acc, [key]: extractedValue };
  }, {});

  return staticProperties;
};
