import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography
} from '@mui/material';
import { Control, Controller } from 'react-hook-form';

import { IFilterGroups, IFilters, IFormState } from './types';

import { ExpandMoreIcon } from '@components/shared/Icons';

interface CheckboxGroupsProps {
  filterGroupsToShow?: IFilterGroups[];
  filters: IFilters;
  control: Control<IFormState>;
  hasExpandIcon?: boolean;
  hasAccordionControl?: boolean;
}

const CheckboxGroups = ({
  filters,
  control,
  filterGroupsToShow = [],
  hasExpandIcon = true,
  hasAccordionControl = true
}: CheckboxGroupsProps) =>
  filterGroupsToShow.map(({ filterBy, fields, title, fieldsFormatting }) => (
    <Accordion
      key={filterBy}
      disableGutters
      defaultExpanded={Boolean(filters[filterBy].length)}
      sx={{ width: '100%' }}
    >
      {hasAccordionControl ? (
        <AccordionSummary
          expandIcon={hasExpandIcon ? <ExpandMoreIcon /> : null}
        >
          <Typography variant="body1">{title}</Typography>
        </AccordionSummary>
      ) : null}
      <AccordionDetails>
        <FormGroup>
          {fields.map((type) => (
            <FormControlLabel
              key={type}
              label={
                fieldsFormatting
                  ? fieldsFormatting.find((field) => field.key === type)
                      ?.value || type
                  : type
              }
              control={
                <Controller
                  control={control}
                  name={`filters.${filterBy}`}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      checked={value.includes(type)}
                      onChange={(e) => {
                        const updatedDataTypes = e.target.checked
                          ? [...value, type]
                          : value.filter((item) => item !== type);
                        onChange(updatedDataTypes);
                      }}
                    />
                  )}
                />
              }
            />
          ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  ));

export default CheckboxGroups;
