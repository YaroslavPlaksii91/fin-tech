import { findAll } from 'highlight-words-core';

import { palette } from '@theme';

export const highlightText = (
  searchWords: string[],
  textToHighlight: string
) => {
  try {
    const chunks = findAll({
      searchWords: searchWords,
      textToHighlight: textToHighlight
    });

    return chunks
      .map((chunk) => {
        const { end, highlight, start } = chunk;
        const text = textToHighlight.substring(start, end);
        if (highlight) {
          return `<mark style="background-color: ${palette.yellow}">${text}</mark>`;
        } else {
          return text;
        }
      })
      .join('');
  } catch (e) {
    return textToHighlight;
  }
};

export const modifyFirstLetter = (
  string: string,
  action: 'capitalize' | 'lower' = 'lower'
) => {
  switch (action) {
    case 'capitalize':
      return string.charAt(0).toUpperCase() + string.slice(1);
    case 'lower':
      return string.charAt(0).toLowerCase() + string.slice(1);
    default:
      return string;
  }
};

export const convertToPascalCase = (str: string, delimiter: string = '.') =>
  str.replace(new RegExp(`(^\\w|\\${delimiter}\\w)`, 'g'), (match) =>
    match.toUpperCase()
  );
