import { useForm } from 'react-hook-form';

import Template, { TemplateProps } from '@components/shared/Filters';
import DatePicker from '@components/shared/Forms/DatePicker';
import InputText from '@components/shared/Forms/InputText';
import { IFilters } from '@pages/LeadRequestsReports/types';
import Range from '@components/shared/Forms/Range';
import Autocomplete from '@components/shared/Autocomplete/Autocomplete';

interface FiltersProps
  extends Pick<TemplateProps, 'isOpen' | 'onClose' | 'onReset'> {
  filters: IFilters;
  onSubmit: (data: IFilters) => void;
}

const Filters = ({
  isOpen,
  filters,
  onClose,
  onReset,
  onSubmit
}: FiltersProps) => {
  const { handleSubmit, control, reset } = useForm<IFilters>({
    values: { ...filters }
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
      <Autocomplete
        label="Lead Provider"
        placeholder="Lead Provider"
        name="leadProvider"
        control={control}
      />
      <InputText
        fullWidth
        name="loanId"
        label="Loan ID"
        placeholder="Loan ID"
        type="number"
        control={control}
      />
      <InputText
        fullWidth
        name="customerId"
        label="Customer ID"
        placeholder="Customer ID"
        type="number"
        control={control}
      />
      <Range
        title="Lead Price"
        startAdornmentSymb="$"
        name="leadPrice"
        type="number"
        control={control}
      />
      <Range
        title="Requested Amount"
        startAdornmentSymb="$"
        type="number"
        name="requestedAmount"
        control={control}
      />
      <InputText
        fullWidth
        name="affiliate"
        label="Affiliate"
        placeholder="Affiliate"
        control={control}
      />
      <InputText
        fullWidth
        name="ssn"
        label="SSN"
        placeholder="SSN"
        control={control}
      />
      <InputText
        fullWidth
        name="email"
        label="Email"
        placeholder="Email"
        control={control}
      />
      <InputText
        fullWidth
        name="denialReason"
        label="Denial Reason"
        placeholder="Denial Reason"
        control={control}
      />
      <InputText
        fullWidth
        name="apiVersion"
        label="API Version"
        placeholder="API Version"
        control={control}
      />
      <InputText
        fullWidth
        name="cachedConnector"
        label="Cached Connector"
        placeholder="Cached Connector"
        control={control}
      />
      <DatePicker
        hasTimePicker
        name="requestDate.from"
        label="Date From"
        control={control}
      />
      <DatePicker
        hasTimePicker
        name="requestDate.to"
        label="Date To"
        control={control}
      />
    </Template>
  );
};

export default Filters;
