export class ExpressionEditorCore {
  private readonly operators: string[];

  constructor(operators: string[]) {
    this.operators = operators;
  }

  findLeftOperator(inputValue: string, searchPosition: number) {
    const substringBeforeCursor = inputValue.substring(0, searchPosition);

    let nearestOperator = null;

    for (const operator of this.operators) {
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

    return nearestOperator ? nearestOperator.operator : null;
  }

  extractExpressionLastPart(value: string) {
    const regex = /\w+$/;
    const match = value.match(regex);
    return match ? match[0] : value;
  }

  replaceLastWord(value: string, replacement: string) {
    const regex = /\b\w+\b$/;
    return value.replace(regex, replacement);
  }
}
