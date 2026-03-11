import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Upload from './pages/Upload';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <Dashboard />,
    visible: true
  },
  {
    name: 'SKU分析',
    path: '/analysis',
    element: <Analysis />,
    visible: true
  },
  {
    name: '上传数据',
    path: '/',
    element: <Upload />,
    visible: false
  }
];

export default routes;
