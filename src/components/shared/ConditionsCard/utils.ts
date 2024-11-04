import { CaseEntry } from '@views/DecisionTable/types';

export const getFormattedRules = (data: CaseEntry[]) =>
  data.map((rule, index) => {
    const conditions = rule.conditions
      .map((condition) => {
        const { name, operator, expression } = condition;
        const operatorMapping: Record<string, string> = {
          any: 'is any',
          between: 'is between'
        };
        const operatorStr = operatorMapping[operator] || operator;

        return `${name} ${operatorStr} ${expression}`.trim();
      })
      .filter(Boolean);

    const actions = rule.actions
      .map((action) =>
        action.expression
          ? `${action.name} = ${action.expression}`
          : action.name
      )
      .filter(Boolean);

    return {
      keyword:
        index === 0 ? 'If' : index < data.length - 1 ? 'Else if' : 'Else',
      conditions: index < data.length - 1 ? conditions : [],
      actions,
      edgeId: rule.edgeId
    };
  });
