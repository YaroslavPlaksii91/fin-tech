import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController
} from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import {
  FormControl,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';

import { StyledInfoIcon } from './styled';

import CloseIcon from '@icons/cross.svg';

export interface InputTextFormProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {}

export interface InputTextBasicProps {
  clearable?: boolean;
  label?: string;
  placeholder?: string;
  fullWidth?: boolean;
  type?: string;
  startAdornmentSymb?: string;
  hint?: string;
}

const InputText = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  placeholder,
  label,
  startAdornmentSymb,
  type = 'text',
  fullWidth = false,
  clearable = false,
  disabled = false,
  hint,
  InputProps,
  ...props
}: InputTextFormProps<TFieldValues, TName> &
  InputTextBasicProps &
  TextFieldProps) => {
  const { field, fieldState } = useController({ control, name });

  const handleClear = () => field.onChange('');

  return (
    <FormControl fullWidth={fullWidth} variant="standard">
      <TextField
        placeholder={placeholder}
        size="small"
        error={!!fieldState?.error}
        helperText={fieldState?.error?.message}
        id={name}
        type={type}
        label={label}
        InputProps={{
          sx: { paddingRight: 0 },
          startAdornment: startAdornmentSymb ? (
            <InputAdornment position="start">
              {startAdornmentSymb}
            </InputAdornment>
          ) : null,
          endAdornment: (
            <>
              {clearable && !disabled && field.value?.length > 0 && (
                <InputAdornment position="end">
                  <IconButton
                    sx={{ mr: '7px' }}
                    size="small"
                    aria-label="clear-options"
                    onClick={handleClear}
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              )}
              {hint && (
                <InputAdornment position="start">
                  <Tooltip
                    title={<span dangerouslySetInnerHTML={{ __html: hint }} />}
                    placement="bottom-end"
                    sx={{ cursor: 'pointer' }}
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [0, -10]
                            }
                          }
                        ]
                      }
                    }}
                    componentsProps={{
                      tooltip: {
                        sx: {
                          width: '200px'
                        }
                      }
                    }}
                  >
                    <StyledInfoIcon />
                  </Tooltip>
                </InputAdornment>
              )}
            </>
          ),
          ...InputProps
        }}
        {...field}
        disabled={disabled}
        {...props}
      />
    </FormControl>
  );
};

export default InputText;
