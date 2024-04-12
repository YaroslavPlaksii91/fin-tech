import { findAll } from 'highlight-words-core';

import { palette } from '../themeConfig.ts';

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
