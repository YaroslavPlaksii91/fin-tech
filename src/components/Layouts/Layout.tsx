import { Outlet } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';

import Navigation from '../Navigation/Navigation';

import { LayoutContainer, MainContainer } from './MainLayout';

import Sidebar from '@components/Sidebar/Sidebar';
import { ActiveStepProvider } from '@contexts/StepContext';
import CrossPlatformDrawer from '@components/CrossPlatformDrawer/CrossPlatformDrawer';

export default function Layout() {
  return (
    <>
      <Navigation />
      <ReactFlowProvider>
        <ActiveStepProvider>
          <LayoutContainer>
            <CrossPlatformDrawer />
            <Sidebar />
            <MainContainer>
              <Outlet />
            </MainContainer>
          </LayoutContainer>
        </ActiveStepProvider>
      </ReactFlowProvider>
    </>
  );
}
