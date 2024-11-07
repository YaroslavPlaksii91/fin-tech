import { StyledNavLink } from './styled';

interface LinkProps {
  path: string;
  label: string;
}

const Link = ({ path, label }: LinkProps) => (
  <StyledNavLink end to={path}>
    {label}
  </StyledNavLink>
);

export default Link;
