import GridWeb from '@icons/gridWeb.svg';

export const AutoLayoutButton: React.FC<{ onClick: () => void }> = ({
  onClick
}) => (
  <button className="react-flow-autolayout-action" onClick={onClick}>
    <GridWeb />
    Autolayout
  </button>
);
