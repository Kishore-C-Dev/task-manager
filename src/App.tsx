import React from 'react';
import { BrowserRouter, useRoutes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import EntityListPage from './pages/EntityListPage';
import EntityFormPage from './pages/EntityFormPage';
import appConfig from './config/appConfig.json';
import { AppConfig } from './types';
import './App.css';

const appCfg = appConfig as AppConfig;

function AppRoutes() {
  const routeObjects: any[] = [
    { path: '/', element: <Navigate to={appCfg.app.navigation[0]?.path || '/requests'} replace /> },
  ];

  Object.keys(appCfg.pages).forEach((key) => {
    routeObjects.push(
      { path: `/${key}`, element: <EntityListPage entityKey={key} /> },
      { path: `/${key}/new`, element: <EntityFormPage entityKey={key} /> },
      { path: `/${key}/edit/:id`, element: <EntityFormPage entityKey={key} /> },
    );
  });

  return useRoutes(routeObjects);
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  );
};

export default App;
