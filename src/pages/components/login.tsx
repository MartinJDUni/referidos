import React, { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Login.module.css';

const Login: FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Verifica si el usuario está autenticado al cargar la página
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      // Si el usuario está autenticado, redirige a la página deseada
      router.push('/Employee/InicioEmployee');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/authentification', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // La autenticación fue exitosa
        const userData = await response.json();
        console.log('Respuesta del servidor:', userData);
        console.log('ID del Usuario:', userData.authenticatedUser.id);
        localStorage.setItem('userId', userData.authenticatedUser.id);

        router.push('/Employee/InicioEmployee');
      } else {
        // Verificar si la respuesta es JSON antes de intentar analizarla
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setError(data.error || 'Credenciales incorrectas');
        } else {
          setError('Error de servidor. Por favor, inténtalo de nuevo.');
        }
      }
    } catch (error) { 
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
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
