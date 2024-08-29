import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import { FILTER_GROUPS, INITIAL_FILTERS } from '../constants';

import Template, { TemplateProps } from '@components/Filters/Template';
import { InputText } from '@components/shared/Forms/InputText';
import Select from '@components/shared/Forms/Select';

export interface IFormState {
  search: string;
  filters: typeof INITIAL_FILTERS;
}

interface FiltersProps
  extends Pick<TemplateProps, 'isOpen' | 'onClose' | 'onReset'>,
    IFormState {
  filterGroups: typeof FILTER_GROUPS;
  onSubmit: (data: IFormState) => void;
}

const Filters = ({
  isOpen,
  search,
  filters,
  filterGroups,
  onClose,
  onReset,
  onSubmit
}: FiltersProps) => {
  const { handleSubmit, control, reset } = useForm<IFormState>({
    values: { search, filters }
  });

  useEffect(() => {
    reset();
  }, [isOpen]);

  return (
    <Template
      isOpen={isOpen}
      onClose={onClose}
      onReset={onReset}
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputText
        fullWidth
        name="search"
        label="Search By Keyword"
        placeholder="Search By Keyword"
        control={control}
      />
      {filterGroups.map(({ fields, filterBy, text }) => (
        <Select
          fullWidth
          multiple
          clearable
          key={filterBy}
          name={`filters.${filterBy}`}
          variant="outlined"
          label={text}
          control={control}
          options={fields.map((option) => ({
            value: option,
            label: option
          }))}
        />
      ))}
    </Template>
  );
};

export default Filters;
