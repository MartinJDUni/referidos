import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "@/styles/Header.module.css"; // Estilo personalizado

const Header: React.FC = () => {
  return (
    <header className={`navbar navbar-expand-lg ${styles.header}`}>
      <div className="container">
        <Link href="/" legacyBehavior>
          <a className="navbar-brand">Your Logo</a>
        </Link>

        <div className={`ml-auto position-relative ${styles.dropdownContainer}`}>
          <button
            className="nav-link dropdown-toggle"
            type="button"
            id="navbarDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            User
          </button>
          <ul className={`custom-dropdown-menu dropdown-menu ${styles.dropdownMenu}`} aria-labelledby="navbarDropdown">
            <li>
              <Link href="/profile" legacyBehavior>
                <a className="dropdown-item">Profile</a>
              </Link>
            </li>
            <li>
              <Link href="/sign-out" legacyBehavior>
                <a className="dropdown-item">Sign out</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
