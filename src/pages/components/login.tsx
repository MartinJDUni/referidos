import React, { FC } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Login.module.css';

const Login: FC = () => {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se pretende hacer la autenticación
    router.push('/Graphics');
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles['login-form']}>
          <img src="../images/logo.png" alt="Logo-login" className={styles['logo-login']} />
          <h2>Inicio de Sesión</h2>
          <form onSubmit={handleLogin}>
            <input className={styles.input} type="text" placeholder="Username" />
            <input className={styles.input} type="password" placeholder="Password" />
            <div className={styles.buttonContainer}>
              <button className={styles.button} type="submit">
                Ingresar
              </button>
              <button className={styles.registerButton} type="submit">
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
