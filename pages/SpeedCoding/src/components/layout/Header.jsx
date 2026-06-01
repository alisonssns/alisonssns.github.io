import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Header.module.css";

const navLinks = [
    { name: "Início", path: "/home" },
    { name: "Jogos", path: "/games" },
    { name: "Ranking", path: "/ranking" },
    { name: "Histórico", path: "/history" },
    { name: "Perfil", path: "/profile" },
];

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <header className={styles.header}>
            <Link to="/home" className={styles.logo}>
                SPEED CODING
            </Link>

            <nav className={styles.nav}>
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`${styles.navLink} ${
                            location.pathname === link.path ? styles.selected : ''
                        }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>

            <div className={styles.userArea}>
                <Link to="/profile" className={styles.profileLink}>
                    <div className={styles.avatar}>
                        {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className={styles.username}>{user?.nome}</span>
                </Link>

                <button onClick={handleLogout} className={styles.logoutButton}>
                    SAIR
                </button>
            </div>
        </header>
    );
}