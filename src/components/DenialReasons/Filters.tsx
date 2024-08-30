import { useForm } from 'react-hook-form';

import Template, { TemplateProps } from '@components/shared/Filters';
import DatePicker from '@components/shared/Forms/DatePicker';
import { IDateFilters } from '@pages/DenialReasons/types';
import InputText from '@components/shared/Forms/InputText';

export interface IFormState {
  dateFilters: IDateFilters;
  denialReasons: string;
  deniedBy: string;
}

interface FiltersProps
  extends Pick<TemplateProps, 'isOpen' | 'onClose' | 'onReset'>,
    IFormState {
  onSubmit: (data: IFormState) => void;
}

const Filters = ({
  isOpen,
  dateFilters,
  denialReasons,
  deniedBy,
  onClose,
  onReset,
  onSubmit
}: FiltersProps) => {
  const { handleSubmit, control, reset } = useForm<IFormState>({
    values: { dateFilters, denialReasons, deniedBy }
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
        name="denialReasons"
        label="Denial Reasons"
        placeholder="Denial Reasons"
        control={control}
      />
      <InputText
        fullWidth
        name="deniedBy"
        label="Denied by"
        placeholder="Denied by"
        control={control}
      />
      <DatePicker name="dateFilters.from" label="Date From" control={control} />
      <DatePicker name="dateFilters.to" label="Date To" control={control} />
    </Template>
  );
};

export default Filters;
