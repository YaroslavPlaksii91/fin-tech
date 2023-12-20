import React from 'react';

import { StyledNavLink } from './styled';

interface Props {
  path: string;
  label: string;
}

const Link: React.FC<Props> = ({ path, label }) => (
  <StyledNavLink end to={path}>
    {label}
  </StyledNavLink>
);

export default Link;
