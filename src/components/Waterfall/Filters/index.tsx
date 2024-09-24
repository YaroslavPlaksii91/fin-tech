import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import validationSchema from './validationSchema';

import Template, { TemplateProps } from '@components/shared/Filters';
import DatePicker from '@components/shared/Forms/DatePicker';
import { IFilters } from '@pages/Waterfall/types';
import Range from '@components/shared/Forms/Range';
import { RANGE_FILTERS_GROUPS } from '@pages/Waterfall/constants';
import Select, { Option } from '@components/shared/Forms/Select';

interface FiltersProps
  extends Pick<TemplateProps, 'isOpen' | 'onClose' | 'onReset'> {
  filters: IFilters;
  stackOptions: Option[];
  campaignIdOptions: Option[];
  onSubmit: (data: IFilters) => void;
}

const Filters = ({
  isOpen,
  filters,
  stackOptions,
  campaignIdOptions,
  onClose,
  onReset,
  onSubmit
}: FiltersProps) => {
  const { handleSubmit, control, reset } = useForm<IFilters>({
    values: { ...filters },
    // @ts-expect-error This @ts-expect-error directive is necessary because of a compatibility issue between the resolver type and the validationSchema type.
    resolver: yupResolver(validationSchema)
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
      <Select
        multiple
        fullWidth
        name="stack"
        label="Stack"
        placeholder="Stack"
        options={stackOptions}
        control={control}
      />
      <Select
        multiple
        fullWidth
        name="campaignId"
        label="Campaign ID"
        placeholder="Campaign ID"
        options={campaignIdOptions}
        control={control}
      />
      <DatePicker name="date.from" label="Date From" control={control} />
      <DatePicker name="date.to" label="Date To" control={control} />
      {RANGE_FILTERS_GROUPS.map(({ title, name, symb }) => (
        <Range
          key={title}
          title={title}
          startAdornmentSymb={symb}
          name={name}
          control={control}
        />
      ))}
    </Template>
  );
};

export default Filters;
