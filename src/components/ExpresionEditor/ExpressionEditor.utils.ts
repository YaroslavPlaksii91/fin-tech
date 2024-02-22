import { Chunk, findAll } from 'highlight-words-core';
import color from 'color';

import {
  FunctionConfig,
  functionsConfig,
  functionsConfigDict,
  sortedFunctionsConfig
} from '@components/ExpresionEditor/ExpressionEditor.constants.ts';

export function filterFunctionsSuggestList(
  value: string,
  currentOperatorLiteral?: string
): FunctionConfig[] {
  if (!value) {
    return [];
  }

  if (!currentOperatorLiteral) {
    const lastPart = regExpHelpers.extractExpressionLastPart(value);
    return sortedFunctionsConfig.filter(({ literal }) =>
      literal.startsWith(lastPart.toUpperCase())
    );
  }

  return [];
}

export const regExpHelpers = {
  findLeftOperator(
    inputValue: string,
    searchPosition: number,
    operators: string[]
  ) {
    const substringBeforeCursor = inputValue.substring(0, searchPosition);

    let nearestOperator = null;

    for (const operator of operators) {
      const lastIndex = substringBeforeCursor.lastIndexOf(operator);

      const hasOpeningParenthesis =
        inputValue[lastIndex + operator.length] === '(';

      if (
        lastIndex !== -1 &&
        (hasOpeningParenthesis || searchPosition === inputValue.length) &&
        (nearestOperator === null || lastIndex > nearestOperator.index)
      ) {
        nearestOperator = { operator, index: lastIndex };
      }
    }

    const openParentheses = (inputValue.match(/\(/g) || []).length;
    const closeParentheses = (inputValue.match(/\)/g) || []).length;

    if (openParentheses === closeParentheses) {
      return null;
    }

    return nearestOperator ? nearestOperator : null;
  },

  extractExpressionLastPart(value: string) {
    const regex = /\w+$/;
    const match = value.match(regex);
    return match ? match[0] : value;
  },

  replaceLastWord(value: string, replacement: string) {
    const regex = /\b\w+\b$/;
    return value.replace(regex, replacement);
  },

  extractArgumentsFromDomesticDescription(description: string) {
    const pattern = /\s*,\s*(?![^[]*\])/;
    const result = description.split(pattern);
    return result.map((value) => value.trim());
  }
};

export function highlightChunks(textToHighlight: string): string {
  const searchWords = functionsConfig.map(({ literal }) => literal);

  const chunks: Chunk[] = findAll({
    searchWords,
    textToHighlight
  });

  return chunks
    .map((chunk: Chunk) => {
      const { end, highlight, start } = chunk;
      const text = textToHighlight.substr(start, end - start);

      const literalConfig = functionsConfigDict[text];
      const spanColor = literalConfig?.color
        ? color(literalConfig?.color)
            .darken(0.5)
            .toString()
        : 'inherit';

      if (highlight) {
        return `<span style="color: ${spanColor}">${text}</span>`;
      } else {
        return text;
      }
    })
    .join('');
}
