import { Outlet } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';

import Navigation from '../Navigation/Navigation';

import { LayoutContainer, MainContainer } from './MainLayout';

import Sidebar from '@components/Sidebar/Sidebar';
import { ActiveStepProvider } from '@contexts/StepContext';

export default function Layout() {
  return (
    <>
      <Navigation />
      <ReactFlowProvider>
        <ActiveStepProvider>
          <LayoutContainer>
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
