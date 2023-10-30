import React, { FC, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Login.module.css';

const Login: FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enviar las credenciales al servidor para autenticación
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // La autenticación fue exitosa
        router.push('/Admin/Graphics');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles['login-form']}>
          <img src="../images/logo.png" alt="Logo-login" className={styles['logo-login']} />
          <h2>Inicio de Sesión</h2>
          <form onSubmit={handleLogin}>
            <input
              className={styles.input}
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={styles.buttonContainer}>
              <button className={styles.button} type="submit">
                Ingresar
              </button>
              <button className={styles.registerButton} type="button">
                Registrarse
              </button>
            </div>
          </form>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </>
  );
};

export default Login;