import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import isEmpty from 'lodash/isEmpty';

import validationSchema from './validationSchema';

import Template, { TemplateProps } from '@components/shared/Filters';
import DatePicker from '@components/shared/Forms/DatePicker';
import { COLUMN_IDS, IFilters } from '@pages/Waterfall/types';
import Range from '@components/shared/Forms/Range';
import { RANGE_FILTERS_GROUPS } from '@pages/Waterfall/constants';
import { reportingService } from '@services/reports';
import Autocomplete from '@components/shared/Autocomplete/Autocomplete';
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

  const getWaterfallOptionsForField = useCallback(
    async (field: string) =>
      await reportingService.getWaterfallReportFieldOptions(field),
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
        id="stack-multiselect"
        label="Stack"
        placeholder="Stack"
        name="stack"
        control={control}
        fieldPath={COLUMN_IDS.stack}
        getOption={getWaterfallOptionsForField}
      />
      <Autocomplete
        id="campaignId-multiselect"
        label="Campaign ID"
        placeholder="Campaign ID"
        name="campaignId"
        control={control}
        fieldPath={COLUMN_IDS.campaignId}
        getOption={getWaterfallOptionsForField}
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
      {RANGE_FILTERS_GROUPS.map(({ title, name, symb }) => (
        <Range
          key={title}
          title={title}
          startAdornmentSymb={symb}
          name={name}
          control={control}
          inputProps={{ min: MIN_RANGE_VALUE_FILTER }}
          style={{ marginBottom: '8px' }}
        />
      ))}
    </Template>
  );
};

export default Filters;
