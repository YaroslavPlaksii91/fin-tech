import { Chunk, findAll } from 'highlight-words-core';
import color from 'color';

import {
  FunctionConfig,
  functionsConfig,
  functionsConfigDict,
  sortedFunctionsConfig
} from '@components/ExpressionEditor/ExpressionEditor.constants';

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
  findLeftOperator(input: string, caretPosition: number, operators: string[]) {
    const substringBeforeCaret = input.substring(0, caretPosition);

    const openFunctions = Array.from(
      substringBeforeCaret.matchAll(/[A-Z_]+\(/g)
    );
    const closingBrackets = Array.from(substringBeforeCaret.matchAll(/\)/g));

    while (closingBrackets.length) {
      const el = closingBrackets.pop();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
      const index: number = openFunctions.findLastIndex(
        (element: { index: number }) => element.index < Number(el?.index)
      );
      if (index !== -1) {
        openFunctions.splice(index, 1);
      }
    }

    if (openFunctions.length) {
      const match = openFunctions[openFunctions.length - 1];
      const operator = match[0].replace('(', '').trim();

      if (!operators.includes(operator)) {
        return null;
      }

      return {
        operator,
        index: match.index
      };
    }

    return null;
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
        ? color(literalConfig?.color).darken(0.5).toString()
        : 'inherit';

      if (highlight) {
        return `<span style="color: ${spanColor}">${text}</span>`;
      } else {
        return text;
      }
    })
    .join('');
}

export const getDomesticDescriptionForGetReportFunction = (
  domesticDescription: string,
  controlFiles: string[]
) => {
  const textControlFiles = controlFiles.map((file) => `"${file}"`).join(', ');

  return `${domesticDescription} ${textControlFiles})`;
};
