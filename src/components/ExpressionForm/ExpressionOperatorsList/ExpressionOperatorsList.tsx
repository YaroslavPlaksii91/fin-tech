import { Stack, Typography } from '@mui/material';
import React from 'react';

import { palette } from '../../../themeConfig.ts';

import {
  StyledButton,
  StyledContainer
} from './ExpressionOperatorsList.styles.ts';

const ExpressionOperatorsList: React.FC<ExpressionOperatorsListProps> = ({
  title = 'Add Function',
  list,
  onItemClick
}) => (
  <StyledContainer>
    <Typography variant="body1" color={palette.gray}>
      {title}
    </Typography>
    {list.map((category, index) => (
      <Stack key={index} pt={1.5} direction="row" flexWrap="wrap" gap={0.5}>
        {category.map(({ literal }) => (
          <StyledButton onClick={() => onItemClick(literal)} key={literal}>
            {literal}
          </StyledButton>
        ))}
      </Stack>
    ))}
  </StyledContainer>
);

interface ExpressionOperatorsListProps {
  title?: string;
  list: {
    literal: string;
  }[][];
  onItemClick: (payload: string) => void;
}

export default React.memo(ExpressionOperatorsList);
