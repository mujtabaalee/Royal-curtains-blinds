import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LayoutDashboard, Image as ImageIcon, BookOpen, LogOut, Package } from 'lucide-react';
import styles from './DashboardLayout.module.css';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.title}>Royal<span className={styles.gold}>Admin</span></h2>
        </div>
        
        <nav className={styles.nav}>
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => `${styles.navItem}`} 
            data-active={window.location.pathname === '/admin'}
            onClick={(e) => {
              if (window.location.pathname === '/admin') e.preventDefault();
            }}
            style={({ isActive }) => isActive && window.location.pathname === '/admin' ? { background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)' } : {}}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => `${styles.navItem}`}
            style={({ isActive }) => isActive ? { background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)' } : {}}
          >
            <Package size={20} />
            Products
          </NavLink>
          <NavLink 
            to="/admin/blog" 
            className={({ isActive }) => `${styles.navItem}`}
            style={({ isActive }) => isActive ? { background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)' } : {}}
          >
            <BookOpen size={20} />
            Blog Posts
          </NavLink>
          <NavLink 
            to="/admin/gallery" 
            className={({ isActive }) => `${styles.navItem}`}
            style={({ isActive }) => isActive ? { background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)' } : {}}
          >
            <ImageIcon size={20} />
            Gallery
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>Content Management System</h1>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
