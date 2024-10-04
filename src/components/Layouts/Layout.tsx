import { Outlet } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import { useEffect } from 'react';

import Navigation from '../Navigation/Navigation';

import { LayoutContainer, MainContainer } from './MainLayout';

import Sidebar from '@components/Sidebar/Sidebar';
import { ActiveStepProvider } from '@contexts/StepContext';
import CrossPlatformDrawer from '@components/CrossPlatformDrawer/CrossPlatformDrawer';
import { useLoading } from '@contexts/LoadingContext';
import { useAppDispatch } from '@store/hooks';
import {
  fetchIntegrationVariables,
  fetchVariables
} from '@store/dataDictionary/asyncThunk';
import { setEnumDataTypes } from '@store/dataDictionary';
import Logger from '@utils/logger';

export default function Layout() {
  const dispatch = useAppDispatch();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetchDataDictionaryVariables = async () => {
      try {
        startLoading();
        await Promise.allSettled([
          dispatch(fetchVariables()),
          dispatch(fetchIntegrationVariables())
        ]);
        dispatch(setEnumDataTypes());
      } catch (error) {
        Logger.error('Error data dictionary variables:', error);
      } finally {
        stopLoading();
      }
    };

    void fetchDataDictionaryVariables();
  }, []);

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
