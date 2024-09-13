import GridWeb from '@icons/gridWeb.svg';

export const AutoLayoutButton: React.FC<{ handleAutoLayout: () => void }> = ({
  handleAutoLayout
}) => (
  <button className="react-flow-autolayout-action" onClick={handleAutoLayout}>
    <GridWeb />
    Autolayout
  </button>
);
