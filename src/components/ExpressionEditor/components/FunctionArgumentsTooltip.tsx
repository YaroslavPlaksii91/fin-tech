import React from 'react';
import { ListItemText, MenuItem, Paper } from '@mui/material';
import Highlighter from 'react-highlight-words';

import {
  ExpressionEditorFunction,
  functionsConfigDict
} from '@components/ExpressionEditor/ExpressionEditor.constants.ts';
import {
  getDomesticDescriptionForGetReport,
  regExpHelpers
} from '@components/ExpressionEditor/ExpressionEditor.utils.ts';
import styles from '@components/ExpressionEditor/ExpressionEditor.module.scss';

// @TODO: Based on the cursor position in post-MVP?
const FunctionArgumentsTooltip: React.FC<FunctionArgumentsTooltipProps> = ({
  value,
  currentOperatorIndex,
  currentOperatorLiteral,
  controlFiles
}) => {
  if (!currentOperatorLiteral) {
    return null;
  }

  const currentConfig = functionsConfigDict[currentOperatorLiteral];

  // TODO add check to ''
  const domesticDescription =
    currentConfig.literal == ExpressionEditorFunction.GET_REPORT
      ? getDomesticDescriptionForGetReport(
          currentConfig.domesticDescription,
          controlFiles
        )
      : currentConfig.domesticDescription;

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
    currentConfig.literal !== ExpressionEditorFunction.GET_REPORT
      ? [
          descriptionArgs[
            valueArgs.length > descriptionArgs.length
              ? descriptionArgs.length - 1
              : valueArgs.length - 1
          ]
        ]
      : [];

  return (
    <Paper className={styles.suggestBox} variant="outlined" elevation={12}>
      <MenuItem disableRipple dense>
        <ListItemText
          primaryTypographyProps={{
            style: { textWrap: 'wrap' }
          }}
        >
          {currentOperatorLiteral}
          <Highlighter
            autoEscape={true}
            searchWords={searchWord}
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
  controlFiles: string[];
  currentOperatorLiteral?: string;
}

export default React.memo(FunctionArgumentsTooltip);
