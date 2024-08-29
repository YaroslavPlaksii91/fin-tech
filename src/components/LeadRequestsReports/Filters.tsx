import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import Template, { TemplateProps } from '@components/Filters/Template';
import DatePicker from '@components/shared/Forms/DatePicker';
import { IDateFilters } from '@pages/LeadRequestsReports/types';

export interface IFormState {
  dateFilters: IDateFilters;
}

interface FiltersProps
  extends Pick<TemplateProps, 'isOpen' | 'onClose' | 'onReset'>,
    IFormState {
  onSubmit: (data: IFormState) => void;
}

const Filters = ({
  isOpen,
  dateFilters,
  onClose,
  onReset,
  onSubmit
}: FiltersProps) => {
  const { handleSubmit, control, reset } = useForm<IFormState>({
    values: { dateFilters }
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
      <DatePicker
        hasTimePicker
        name="dateFilters.from"
        label="Date From"
        control={control}
      />
      <DatePicker
        hasTimePicker
        name="dateFilters.to"
        label="Date To"
        control={control}
      />
    </Template>
  );
};

export default Filters;
