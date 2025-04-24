import React, { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import dashboardHome from './dashboardhome.png';
import settingsIcon from './Settings (1).png';
import Logout from '../Logout/Logout';
import plant from "../Dashboard/plant.png";
import addPlantIcon from "../Add-plant/Addplanticon.png";
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Dashboard() {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItemVariants = {
        hidden: { x: -50, opacity: 0 },
        visible: (i) => ({
            x: 0,
            opacity: 1,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    const isActive = (path) => {
        if (path === '/dashboard/add-plant' && location.pathname === '/dashboard') return true;
        return location.pathname === path;
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // إذا كان المستخدم في الصفحة الرئيسية للداشبورد، سيتم توجيهه إلى صفحة Add Plant
    if (location.pathname === '/dashboard') {
        return <Navigate to="/dashboard/add-plant" replace />;
    }

    return (
        <div className={styles.container}>
            <button
                className={styles.menuButton}
                onClick={toggleSidebar}
                aria-label="Toggle menu"
            >
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            {isSidebarOpen && (
                <div
                    className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.show : ''}`}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <motion.div
                className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.sidebarContent}>
                    <motion.div
                        custom={1}
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Link
                            to="/dashboard/add-plant"
                            className={`${styles.menuItem} ${isActive('/dashboard/add-plant') ? styles.active : ''}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <img src={addPlantIcon} alt="Add Plant" className={styles.icon} />
                            <span>Add plant</span>
                        </Link>
                    </motion.div>

                    <motion.div
                        custom={2}
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Link
                            to="/dashboard/plant"
                            className={`${styles.menuItem} ${isActive('/dashboard/plant') ? styles.active : ''}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <img src={plant} alt="Plant" className={styles.icon} />
                            <span>Plant</span>
                        </Link>
                    </motion.div>

                    <div className={styles.bottomMenu}>
                        <motion.div
                            custom={3}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Link
                                to="/dashboard/settings"
                                className={`${styles.menuItem} ${isActive('/dashboard/settings') ? styles.active : ''}`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <img src={settingsIcon} alt="Settings" className={styles.icon} />
                                <span>Settings</span>
                            </Link>
                        </motion.div>

                        <motion.div
                            custom={4}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Logout />
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <div className={styles.mainContent}>
                <div className={styles.content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
} 