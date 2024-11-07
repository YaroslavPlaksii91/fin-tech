import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import isEmpty from 'lodash-es/isEmpty';

import validationSchema from './validationSchema';

import { IFilters } from '@pages/DenialReasons/types';
import Template, { TemplateProps } from '@components/shared/Filters';
import DatePicker from '@components/shared/Forms/DatePicker';
import InputText from '@components/shared/Forms/InputText';
import Autocomplete from '@components/shared/Autocomplete';
import Range from '@components/shared/Forms/Range';
import { reportingService } from '@services/reports';
import { MIN_RANGE_VALUE_FILTER } from '@constants/common';

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
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<IFilters>({
    // @ts-expect-error This @ts-expect-error directive is necessary because of a compatibility issue between the resolver type and the validationSchema type.
    resolver: yupResolver(validationSchema),
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
      isSubmitDisabled={!isEmpty(errors)}
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
        name="rejectionReason"
        label="Denial Reason"
        placeholder="Denial Reason"
        control={control}
      />
      <DatePicker
        name="date.from"
        label="Date From"
        control={control}
        disableFuture
      />
      <DatePicker
        name="date.to"
        label="Date To"
        control={control}
        disableFuture
      />
      <Range
        title="Lead Price"
        startAdornmentSymb="$"
        name="leadPrice"
        control={control}
        inputProps={{ min: MIN_RANGE_VALUE_FILTER }}
      />
    </Template>
  );
};

export default Filters;
