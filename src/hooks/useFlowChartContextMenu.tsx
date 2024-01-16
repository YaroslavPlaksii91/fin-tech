import { useState, useCallback } from 'react';

function useFlowChartContextMenu() {
  const [menu, setMenu] = useState<HTMLElement | null>(null);

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      const targetElement = event.currentTarget as HTMLElement;
      setMenu(targetElement);
    },
    [setMenu]
  );

  return { menu, setMenu, onPaneClick, onNodeContextMenu };
}

export default useFlowChartContextMenu;
