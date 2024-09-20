import { ExpressionValidateParams, Variable } from '@domain/dataDictionary';
import { ExpressionVariableSources } from '@domain/flow';

interface MappingResult {
  params: ExpressionValidateParams;
  variableSources: ExpressionVariableSources;
}

export const mapVariablesToParamsAndSources = (variables: Variable[]) =>
  variables.reduce<MappingResult>(
    (acc, variable) => {
      acc.params.push({
        name: variable.name,
        dataType: variable.dataType
      });

      acc.variableSources.push({
        name: variable.name,
        sourceType: variable.sourceType
      });

      return acc;
    },
    { params: [], variableSources: [] }
  );
