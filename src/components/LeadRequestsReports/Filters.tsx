import { useForm } from 'react-hook-form';

import Template, { TemplateProps } from '@components/shared/Filters';
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
