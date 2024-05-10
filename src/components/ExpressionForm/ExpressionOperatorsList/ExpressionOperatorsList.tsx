import { Chip, Stack } from '@mui/material';
import React from 'react';

const ExpressionOperatorsList: React.FC<ExpressionOperatorsListProps> = ({
  list,
  onItemClick
}) => (
  <Stack pt={1.5} direction="row" flexWrap="wrap" gap={0.5}>
    {list.map((category, index) => (
      <React.Fragment key={index}>
        {category.map(({ literal }) => (
          <Chip
            label={literal}
            onClick={() => onItemClick(literal)}
            key={literal}
          />
        ))}
      </React.Fragment>
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
