import { useForm } from 'react-hook-form';

import { IFilters } from './types';
import { getFiltersGroup } from './utils';

import Template, { TemplateProps } from '@components/shared/Filters';
import InputText from '@components/shared/Forms/InputText';
import Select from '@components/shared/Forms/Select';

interface FiltersProps
  extends Pick<TemplateProps, 'isOpen' | 'onClose' | 'onReset'> {
  filterGroups: ReturnType<typeof getFiltersGroup>;
  filters: IFilters;
  onSubmit: (data: IFilters) => void;
}

const Filters = ({
  isOpen,
  filters,
  filterGroups,
  onClose,
  onReset,
  onSubmit
}: FiltersProps) => {
  const { handleSubmit, control, reset } = useForm<IFilters>({
    values: filters
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Template
      isOpen={isOpen}
      onClose={handleClose}
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
          name={`selects.${filterBy}`}
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
