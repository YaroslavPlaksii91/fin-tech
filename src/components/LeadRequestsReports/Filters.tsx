import { useForm } from 'react-hook-form';

import Template, { TemplateProps } from '@components/shared/Filters';
import DatePicker from '@components/shared/Forms/DatePicker';
import { IDateFilters } from '@pages/LeadRequestsReports/types';
import InputText from '@components/shared/Forms/InputText';

export interface IFormState {
  loanId: string;
  requestId: string;
  dateFilters: IDateFilters;
}

interface FiltersProps
  extends Pick<TemplateProps, 'isOpen' | 'onClose' | 'onReset'>,
    IFormState {
  onSubmit: (data: IFormState) => void;
}

const Filters = ({
  isOpen,
  requestId,
  loanId,
  dateFilters,
  onClose,
  onReset,
  onSubmit
}: FiltersProps) => {
  const { handleSubmit, control, reset } = useForm<IFormState>({
    values: { requestId, loanId, dateFilters }
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
        name="requestId"
        label="Request ID"
        placeholder="Request ID"
        control={control}
      />
      <InputText
        fullWidth
        name="loanId"
        label="Loan ID"
        placeholder="Loan ID"
        control={control}
      />
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
