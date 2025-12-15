import React, { useContext} from "react";
import { useNavigate } from "react-router-dom";
import { Package, Users, BarChart } from 'lucide-react';
import styles from '../../css/admin.module.css';
import { LogOut, House } from 'lucide-react';
import { AuthContext } from '../../components/AuthToken';

export function Sidebar({ activeSection, onNavigate, isOpen }) {

  const { isLoggedIn, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const logoutAndRedirect = () => {
    handleLogout();
    navigate('/home');
  };
  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.active : ''}`}>
      <h2>Admin Panel</h2>
      <nav className={styles["sidebar-nav"]}>
        <div
          className={`${styles["nav-item"]} ${activeSection === 'analytics' ? styles.active : ''}`}
          onClick={() => onNavigate('analytics')}
        >
          <BarChart size={20} />
          <span>Analytics</span>
        </div>

        <div
          className={`${styles["nav-item"]} ${activeSection === 'products' ? styles.active : ''}`}
          onClick={() => onNavigate('products')}
        >
          <Package size={20} />
          <span>Products</span>
        </div>
        <div
          className={`${styles["nav-item"]} ${activeSection === 'orders' ? styles.active : ''}`}
          onClick={() => onNavigate('orders')}
        >
          <Users size={20} />
          <span>Orders</span>
        </div>
      </nav>
      <div className={styles["options-button"]}>
        <button
            className={styles["btn-primary"]}
          onClick={() => {
            window.location.href = "/home";
        }}
        >
            <House size={20}/>
            <span>Home</span>
        </button>
        <button
              onClick={logoutAndRedirect}
              className={styles["btn-secondary"]}
            >
              <LogOut size={20} />
              <span>Log Out</span>
        </button>
      </div>
      
    </div>
  );
}
