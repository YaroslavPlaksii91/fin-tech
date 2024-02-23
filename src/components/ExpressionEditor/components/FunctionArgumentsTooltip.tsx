import React from 'react';
import { ListItemText, MenuItem, Paper } from '@mui/material';
import Highlighter from 'react-highlight-words';

import { functionsConfigDict } from '@components/ExpressionEditor/ExpressionEditor.constants.ts';
import { regExpHelpers } from '@components/ExpressionEditor/ExpressionEditor.utils.ts';
import styles from '@components/ExpressionEditor/ExpressionEditor.module.scss';

// @TODO: Based on cursor position
const FunctionArgumentsTooltip: React.FC<FunctionArgumentsTooltipProps> = ({
  value,
  currentOperatorIndex,
  currentOperatorLiteral
}) => {
  if (!currentOperatorLiteral) {
    return null;
  }

  const currentConfig = functionsConfigDict[currentOperatorLiteral];

  const domesticDescription = currentConfig.domesticDescription || '';
  const rightSideValue = value.substring(currentOperatorIndex);

  const descriptionArgs = regExpHelpers
    .extractArgumentsFromDomesticDescription(
      domesticDescription
        .replace(currentOperatorLiteral, '')
        .replace(/[()]/g, '')
    )
    .map((i) => i.trim());

  const valueArgs = rightSideValue
    .replace(currentOperatorLiteral, '')
    .replace(/\([^()]*\)/g, '')
    .replace(/[()]/g, '')
    .split(',');

  const searchWord =
    descriptionArgs[
      valueArgs.length > descriptionArgs.length
        ? descriptionArgs.length - 1
        : valueArgs.length - 1
    ];

  return (
    <Paper className={styles.suggestBox} variant="outlined" elevation={12}>
      <MenuItem disableRipple dense>
        <ListItemText>
          {currentOperatorLiteral}
          <Highlighter
            autoEscape={true}
            searchWords={[searchWord]}
            textToHighlight={domesticDescription.replace(
              currentOperatorLiteral,
              ''
            )}
          />
        </ListItemText>
      </MenuItem>
    </Paper>
  );
};

interface FunctionArgumentsTooltipProps {
  value: string;
  currentOperatorIndex: number;
  currentOperatorLiteral?: string;
}

export default React.memo(FunctionArgumentsTooltip);
