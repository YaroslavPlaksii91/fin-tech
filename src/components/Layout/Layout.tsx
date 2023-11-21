import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';

import ResponsiveAppBar from '../AppBar/AppBar';

export default function Layout() {
  return (
    <>
      <ResponsiveAppBar />
      <Suspense fallback={<p>Loading...</p>}>
        <Outlet />
      </Suspense>
    </>
  );
}
