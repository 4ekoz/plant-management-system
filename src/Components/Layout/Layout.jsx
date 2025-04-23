import React from 'react';
import styles from './Layout.module.css';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { BiSearch } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import Logout from '../Logout/Logout';

export default function Layout() {
  const location = useLocation();
  const isAuthRoute = [
    '/login',
    '/register',
    '/forgot-password',
    '/resetpassword',
    '/verify-email',
    '/verifycode'
  ].includes(location.pathname);

  if (isAuthRoute) {
    return (
      <div className={styles.container}>
        <Outlet />
      </div>
    );
  }

  return (
    <div className={styles.dashboardLayout}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <Link to="/dashboard/add-plant" className={styles.menuItem}>
            <FaPlus />
            <span>Add plant</span>
          </Link>
          <Link to="/dashboard/plant" className={styles.menuItem}>
            <BiSearch />
            <span>Plant</span>
          </Link>
          <Link to="/dashboard/settings" className={styles.menuItem}>
            <IoMdSettings />
            <span>Settings</span>
          </Link>
          <div className={styles.bottomMenu}>
            <Logout />
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}