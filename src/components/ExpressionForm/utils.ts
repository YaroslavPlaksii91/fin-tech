import { Option } from './types';

// Add correct type for params and variableSources
interface MappingResult {
  params: { name: string; type: string }[];
  variableSources: { name: string; sourceType?: string }[];
}

export const mapVariablesToParamsAndSources = (variables: Option[]) =>
  variables.reduce<MappingResult>(
    (acc, variable) => {
      acc.params.push({
        name: variable.name,
        type: variable.dataType
      });

      acc.variableSources.push({
        name: variable.name,
        sourceType: variable.sourceType
      });

      return acc;
    },
    { params: [], variableSources: [] }
  );
