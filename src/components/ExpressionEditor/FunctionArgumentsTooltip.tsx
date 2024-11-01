import React from 'react';
import { ListItemText, MenuItem } from '@mui/material';
import Highlighter from 'react-highlight-words';

import { functionsConfigDict } from './constants';
import {
  getDomesticDescriptionForGetReportFunction,
  regExpHelpers
} from './utils';
import { StyledPaper } from './styled';
import { ExpressionEditorFunction } from './types';

interface FunctionArgumentsTooltipProps {
  value: string;
  currentOperatorIndex: number;
  controlFiles: string[];
  currentOperatorLiteral?: string;
}

// @TODO: Based on the cursor position in post-MVP?
const FunctionArgumentsTooltip = ({
  value,
  currentOperatorIndex,
  currentOperatorLiteral,
  controlFiles
}: FunctionArgumentsTooltipProps) => {
  if (!currentOperatorLiteral) {
    return null;
  }

  const currentConfig = functionsConfigDict[currentOperatorLiteral];

  //@TODO: Temporary tooltip for GET_REPORT
  const domesticDescription =
    currentConfig.literal == ExpressionEditorFunction.GET_REPORT
      ? getDomesticDescriptionForGetReportFunction(
          currentConfig.domesticDescription,
          controlFiles
        )
      : currentConfig.domesticDescription || '';

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

  //@TODO: Turn off search by word for GET_REPORT as the tooltip does not contain arguments.
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
    <StyledPaper variant="outlined" elevation={0}>
      <MenuItem disableRipple dense>
        <ListItemText
          primaryTypographyProps={{
            style: { textWrap: 'wrap' }
          }}
        >
          {currentOperatorLiteral}
          <Highlighter
            highlightStyle={{ background: '#abdcb9' }}
            autoEscape={true}
            searchWords={searchWord}
            textToHighlight={domesticDescription.replace(
              currentOperatorLiteral,
              ''
            )}
          />
        </ListItemText>
      </MenuItem>
    </StyledPaper>
  );
};

export default React.memo(FunctionArgumentsTooltip);
