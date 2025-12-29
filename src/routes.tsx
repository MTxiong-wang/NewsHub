import HomePage from './pages/HomePage';
import PlatformDetailPage from './pages/PlatformDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminPage from './pages/admin/AdminPage';
import PlatformsManagePage from './pages/admin/PlatformsManagePage';
import UsersManagePage from './pages/admin/UsersManagePage';
import SystemConfigPage from './pages/admin/SystemConfigPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '首页',
    path: '/',
    element: <HomePage />,
  },
  {
    name: '平台详情',
    path: '/platform',
    element: <PlatformDetailPage />,
    visible: false,
  },
  {
    name: '登录',
    path: '/login',
    element: <LoginPage />,
    visible: false,
  },
  {
    name: '注册',
    path: '/register',
    element: <RegisterPage />,
    visible: false,
  },
  {
    name: '我的收藏',
    path: '/favorites',
    element: <FavoritesPage />,
    visible: false,
  },
  {
    name: '管理后台',
    path: '/admin',
    element: <AdminPage />,
    visible: false,
  },
  {
    name: '平台管理',
    path: '/admin/platforms',
    element: <PlatformsManagePage />,
    visible: false,
  },
  {
    name: '用户管理',
    path: '/admin/users',
    element: <UsersManagePage />,
    visible: false,
  },
  {
    name: '系统配置',
    path: '/admin/config',
    element: <SystemConfigPage />,
    visible: false,
  },
];

export default routes;
