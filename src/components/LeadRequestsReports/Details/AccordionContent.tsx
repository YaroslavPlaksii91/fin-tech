import ReactJson from '@microlink/react-json-view';
import { memo } from 'react';

import { theme } from '@theme';
const {
  palette: {
    text: { primary },
    common: { white }
  }
} = theme;

const customTheme = {
  base00: white,
  base01: primary,
  base02: white,
  base03: primary,
  base04: primary,
  base05: primary,
  base06: primary,
  base07: primary,
  base08: primary,
  base09: primary,
  base0A: primary,
  base0B: primary,
  base0C: primary,
  base0D: primary,
  base0E: primary,
  base0F: primary
};

const AccordionContent = ({ json }: { json?: string | null }) =>
  json ? (
    <ReactJson
      displayObjectSize={false}
      displayDataTypes={false}
      src={JSON.parse(json) as object}
      theme={customTheme}
    />
  ) : null;

export default memo(AccordionContent);
