import { Box, Stack, TextFieldProps, Typography } from '@mui/material';
import { FieldPath, FieldValues } from 'react-hook-form';

import InputText, {
  InputTextBasicProps,
  InputTextFormProps
} from '../InputText';

interface RangeProps {
  title: string;
}

const Range = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  startAdornmentSymb,
  title,
  name,
  ...props
}: RangeProps &
  InputTextBasicProps &
  TextFieldProps &
  InputTextFormProps<TFieldValues, TName>) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <Typography variant="body1">{title}</Typography>
    <Stack sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
      <InputText
        fullWidth
        control={control}
        name={`${name}.from` as TName}
        startAdornmentSymb={startAdornmentSymb}
        placeholder="From"
        label="From"
        {...props}
      />
      <InputText
        fullWidth
        control={control}
        name={`${name}.to` as TName}
        startAdornmentSymb={startAdornmentSymb}
        placeholder="To"
        label="To"
        {...props}
      />
    </Stack>
  </Box>
);

export default Range;
