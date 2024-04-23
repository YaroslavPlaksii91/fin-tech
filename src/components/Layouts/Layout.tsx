import { Outlet } from 'react-router-dom';

import Navigation from '../Navigation/Navigation';

import { LayoutContainer, MainContainer } from './MainLayout';

import Sidebar from '@components/Sidebar/Sidebar';
import { StepProvider } from '@contexts/StepContext';

export default function Layout() {
  return (
    <>
      <Navigation />
      <StepProvider>
        <LayoutContainer>
          <Sidebar />
          <MainContainer>
            <Outlet />
          </MainContainer>
        </LayoutContainer>
      </StepProvider>
    </>
  );
}
