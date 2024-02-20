import { Stack, Typography } from '@mui/material';

import { palette } from '../../themeConfig';

import { StyledButton, StyledContainer } from './styled';
import {
  ARITMETIC_OPERATORS,
  BASIC_MATH_FUNCTION,
  BASIC_MISCELANEOUS,
  BASIC_TEXT_FUNCTION,
  COMPARISON_OPERATORS,
  LOGIGAL_OPERATORS
} from './constants';

export default function AddFunction() {
  return (
    <StyledContainer>
      <Typography variant="body1" color={palette.gray}>
        Add Function
      </Typography>
      <Stack pt={1.5} spacing={0.5} direction="row">
        {ARITMETIC_OPERATORS.map((op, key) => (
          <StyledButton key={key}>{op}</StyledButton>
        ))}
      </Stack>
      <Stack pt={1.5} spacing={0.5} direction="row">
        {LOGIGAL_OPERATORS.map((op, key) => (
          <StyledButton key={key}>{op}</StyledButton>
        ))}
      </Stack>
      <Stack pt={1.5} spacing={0.5} direction="row">
        {COMPARISON_OPERATORS.map((op, key) => (
          <StyledButton key={key}>{op}</StyledButton>
        ))}
      </Stack>
      <Stack pt={1.5} spacing={0.5} direction="row">
        {BASIC_TEXT_FUNCTION.map((op, key) => (
          <StyledButton key={key}>{op}</StyledButton>
        ))}
      </Stack>
      <Stack pt={1.5} spacing={0.5} direction="row">
        {BASIC_MATH_FUNCTION.map((op, key) => (
          <StyledButton key={key}>{op}</StyledButton>
        ))}
      </Stack>
      <Stack pt={1.5} spacing={0.5} direction="row">
        {BASIC_MISCELANEOUS.map((op, key) => (
          <StyledButton key={key}>{op}</StyledButton>
        ))}
      </Stack>
    </StyledContainer>
  );
}
