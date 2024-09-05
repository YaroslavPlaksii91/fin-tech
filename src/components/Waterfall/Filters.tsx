import { useForm } from 'react-hook-form';

import Template, { TemplateProps } from '@components/shared/Filters';
import DatePicker from '@components/shared/Forms/DatePicker';
import { IDateFilters } from '@pages/Waterfall/types';
import InputText from '@components/shared/Forms/InputText';

export interface IFormState {
  dateFilters: IDateFilters;
  stack: string;
  campaignId: string;
}

interface FiltersProps
  extends Pick<TemplateProps, 'isOpen' | 'onClose' | 'onReset'>,
    IFormState {
  onSubmit: (data: IFormState) => void;
}

const Filters = ({
  isOpen,
  dateFilters,
  stack,
  campaignId,
  onClose,
  onReset,
  onSubmit
}: FiltersProps) => {
  const { handleSubmit, control, reset } = useForm<IFormState>({
    values: { dateFilters, stack, campaignId }
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
        name="stack"
        label="Stack"
        placeholder="Stack"
        control={control}
      />
      <InputText
        fullWidth
        name="campaignId"
        label="Campaign ID"
        placeholder="Campaign ID"
        control={control}
      />
      <DatePicker name="dateFilters.from" label="Date From" control={control} />
      <DatePicker name="dateFilters.to" label="Date To" control={control} />
    </Template>
  );
};

export default Filters;
