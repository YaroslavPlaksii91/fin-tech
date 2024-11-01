import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as _ from 'lodash-es';

import validationSchema from './validationSchema';

import Template, { TemplateProps } from '@components/shared/Filters';
import DatePicker from '@components/shared/Forms/DatePicker';
import InputText from '@components/shared/Forms/InputText';
import { COLUMN_IDS, IFilters } from '@pages/LeadRequestsReports/types';
import Range from '@components/shared/Forms/Range';
import Autocomplete from '@components/shared/Autocomplete/Autocomplete';
import { reportingService } from '@services/reports';
import { convertToPascalCase } from '@utils/text';
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
      await reportingService.getLeadRequestsReportsFieldOptions(field),
    []
  );

  return (
    <Template
      isSubmitDisabled={!_.isEmpty(errors)}
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
        type="number"
        control={control}
      />
      <Autocomplete
        id="lead-provider-multiselect"
        label="Lead Provider"
        placeholder="Lead Provider"
        name="leadProvider"
        control={control}
        fieldPath={convertToPascalCase(COLUMN_IDS.leadProvider)}
        getOption={getLeadRequestOptionsForField}
      />
      <Autocomplete
        id="lead-campaign-multiselect"
        label="Lead Campaign"
        placeholder="Lead Campaign"
        name="leadCampaign"
        control={control}
        fieldPath={convertToPascalCase(COLUMN_IDS.leadCampaign)}
        getOption={getLeadRequestOptionsForField}
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
        control={control}
        inputProps={{ min: MIN_RANGE_VALUE_FILTER }}
      />
      <InputText
        fullWidth
        name="affiliate"
        label="Affiliate"
        placeholder="Affiliate"
        control={control}
      />
      <DatePicker
        hasTimePicker
        name="requestDate.from"
        label="Date From"
        control={control}
        disableFuture
      />
      <DatePicker
        hasTimePicker
        name="requestDate.to"
        label="Date To"
        control={control}
        disableFuture
      />
      <Range
        title="Requested Amount"
        startAdornmentSymb="$"
        name="requestedAmount"
        control={control}
        inputProps={{ min: MIN_RANGE_VALUE_FILTER }}
      />
      <Autocomplete
        id="stack-name-multiselect"
        label="Stack Name"
        placeholder="Stack Name"
        name="stackName"
        control={control}
        fieldPath={convertToPascalCase(COLUMN_IDS.stackName)}
        getOption={getLeadRequestOptionsForField}
      />
      <Autocomplete
        id="loan-type-multiselect"
        label="Loan Type"
        placeholder="Loan Type"
        name="loanType"
        control={control}
        fieldPath={convertToPascalCase(COLUMN_IDS.loanType)}
        getOption={getLeadRequestOptionsForField}
      />
      <Autocomplete
        id="promo-code-multiselect"
        label="Promo Code"
        placeholder="Promo Code"
        name="promoCode"
        control={control}
        fieldPath={convertToPascalCase(COLUMN_IDS.promoCode)}
        getOption={getLeadRequestOptionsForField}
      />
      <Autocomplete
        id="store-multiselect"
        label="Store"
        placeholder="Store"
        name="store"
        control={control}
        fieldPath={convertToPascalCase(COLUMN_IDS.store)}
        getOption={getLeadRequestOptionsForField}
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
      <Autocomplete
        id="decision-multiselect"
        label="Decision"
        placeholder="Decision"
        name="decision"
        control={control}
        fieldPath={convertToPascalCase(COLUMN_IDS.decision)}
        getOption={getLeadRequestOptionsForField}
      />
      <InputText
        fullWidth
        name="denialReason"
        label="Denial Reason"
        placeholder="Denial Reason"
        control={control}
      />
      <Autocomplete
        id="state-multiselect"
        label="State"
        placeholder="State"
        name="state"
        control={control}
        fieldPath={convertToPascalCase(COLUMN_IDS.state)}
        getOption={getLeadRequestOptionsForField}
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
    </Template>
  );
};

export default Filters;
