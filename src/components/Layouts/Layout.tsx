import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';

import Navigation from '../Navigation/Navigation';

export default function Layout() {
  return (
    <>
      <Navigation />
      <Suspense fallback={<p>Loading...</p>}>
        <Outlet />
      </Suspense>
    </>
  );
}
