import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import { BrandLoadingScreen } from './components/BrandLoadingScreen';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));


export function App() {
  return (
    <Suspense fallback={<BrandLoadingScreen />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
