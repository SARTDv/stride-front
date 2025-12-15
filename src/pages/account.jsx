import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, House } from "lucide-react";
import styles from "../css/account.module.css";
import { AuthContext } from "../components/AuthToken";
import api from '../api/axiosInstance';

function AccountPage() {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [isSuperuser, setIsSuperuser] = useState(false);

  const logoutAndRedirect = () => {
    handleLogout();
    navigate("/home");
  };

  const handleAdminClick = () => {
    navigate("/admin");
  };

  useEffect(() => {
    // Realizar la solicitud al backend
    const fetchUserData = async () => {
      try {
        const response = await api.get("/api/accounts/user-detail/");
        setUserData(response.data);
        setIsSuperuser(response.data.is_staff); // Usar is_staff como indicador de superusuario
        console.log("User data:", response.data);
        console.log("Is superuser:", response.data.is_staff);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response && error.response.status === 401) {
          handleLogout(); // Desloguear si el token es inválido
          navigate("/login");
        }
      }
    };

    fetchUserData();
  }, [navigate, handleLogout]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles["account-container"]}>
      <div className={styles["account-card"]}>
        <h1 className={styles["title"]}>My Account</h1>

        <div className={styles["content"]}>
          <div className={styles["avatar-container"]}>
            <div className={styles["avatar"]}>
              <span>{userData.username.charAt(0).toUpperCase()}</span>
            </div>
          </div>

          <div className={styles["info-section"]}>
            <div className={styles["info-group"]}>
              <label>Username</label>
              <div className={styles["info-box"]}>{userData.username}</div>
            </div>

            <div className={styles["info-group"]}>
              <label>Email</label>
              <div className={styles["info-box"]}>{userData.email}</div>
            </div>
          </div>

          <div className={styles["button-group"]}>
            {isSuperuser ? (
              <button
                onClick={handleAdminClick}
                className={`${styles["btn"]} ${styles["btn-primary"]}`}
              >
                <Settings size={20} />
                <span>Admin</span>
              </button>
            ) : (
              <button
                className={`${styles["btn"]} ${styles["btn-primary"]}`}
                onClick={() => {
                  window.location.href = "/home";
                }}
              >
                <House size={20} />
                <span>Home</span>
              </button>
            )}
            <button
              onClick={logoutAndRedirect}
              className={`${styles["btn"]} ${styles["btn-outline"]}`}
            >
              <LogOut size={20} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
