import { Chip, Stack } from '@mui/material';
import React from 'react';

const ExpressionOperatorsList: React.FC<ExpressionOperatorsListProps> = ({
  list,
  onItemClick
}) => (
  <Stack pt={1.5} direction="row" flexWrap="wrap" gap={0.5}>
    {list.map((category) => (
      <>
        {category.map(({ literal }) => (
          <Chip
            label={literal}
            variant="outlined"
            onClick={() => onItemClick(literal)}
            key={literal}
          />
        ))}
      </>
    ))}
  </Stack>
);

interface ExpressionOperatorsListProps {
  list: {
    literal: string;
  }[][];
  onItemClick: (payload: string) => void;
}

export default React.memo(ExpressionOperatorsList);
