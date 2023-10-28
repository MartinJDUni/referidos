// components/Header.tsx

import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header: React.FC = () => {
  return (
    <header className="navbar navbar-expand-lg bg-light">
      <div className="container">
        <Link href="/" legacyBehavior>
          <a className="navbar-brand">Your Logo</a>
        </Link>

        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              User
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
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
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
