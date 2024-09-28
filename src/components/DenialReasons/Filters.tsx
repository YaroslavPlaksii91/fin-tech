import { useForm } from 'react-hook-form';
import { useCallback } from 'react';

import { IFilters } from '@pages/DenialReasons/types';
import Template, { TemplateProps } from '@components/shared/Filters';
import DatePicker from '@components/shared/Forms/DatePicker';
import InputText from '@components/shared/Forms/InputText';
import Autocomplete from '@components/shared/Autocomplete/Autocomplete';
import Range from '@components/shared/Forms/Range';
import { reportingService } from '@services/reports';

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

  const getLeadRequestOptionsForField = useCallback(
    async (field: string) =>
      await reportingService.getDenialReasonsReportsFieldOptions(field),
    []
  );

  return (
    <Template
      isOpen={isOpen}
      onClose={handleClose}
      onReset={onReset}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Autocomplete
        id="lead-campaign-multiselect"
        label="Lead Campaign"
        placeholder="Lead Campaign"
        name="leadCampaign"
        control={control}
        fieldPath="LeadCampaign"
        getOption={getLeadRequestOptionsForField}
      />
      <Autocomplete
        id="state-multiselect"
        label="State"
        placeholder="State"
        name="state"
        control={control}
        fieldPath="State"
        getOption={getLeadRequestOptionsForField}
      />
      <Autocomplete
        id="stack-multiselect"
        label="Stack"
        placeholder="Stack"
        name="stack"
        control={control}
        fieldPath="Stack"
        getOption={getLeadRequestOptionsForField}
      />
      <Autocomplete
        id="denied-by-multiselect"
        label="Denied By"
        placeholder="Denied By"
        name="deniedBy"
        control={control}
        fieldPath="DeniedBy"
        getOption={getLeadRequestOptionsForField}
      />
      <InputText
        fullWidth
        name="denialReason"
        label="Denial Reason"
        placeholder="Denial Reason"
        control={control}
      />
      <DatePicker name="requestDate.from" label="Date From" control={control} />
      <DatePicker name="requestDate.to" label="Date To" control={control} />
      <Range
        title="Lead Price"
        startAdornmentSymb="$"
        name="leadPrice"
        type="number"
        control={control}
      />
    </Template>
  );
};

export default Filters;
