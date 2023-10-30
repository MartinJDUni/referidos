import { NextApiRequest, NextApiResponse } from 'next';
import { createConnection } from 'mysql2/promise';

async function authenticateUser(email: string, password: string) {
  const connection = await createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Cambia esto por la contraseña de tu base de datos
    database: 'referidos', // Cambia esto por el nombre de tu base de datos
  });

  try {
    const [rows] = await connection.execute('SELECT * FROM employee WHERE email = ? AND password = ?', [email, password]);

    if (rows.length === 0) {
      return null; // Credenciales incorrectas
    }

    return rows[0]; // Devuelve los datos del usuario autenticado
  } catch (error) {
    console.error('Error al autenticar al usuario:', error);
    throw error;
  } finally {
    connection.end();
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Faltan datos obligatorios' });
      return;
    }

    // Lógica de autenticación
    try {
      const user = await authenticateUser(email, password);

      if (user) {
        // Autenticación exitosa
        res.status(200).json({ message: 'Inicio de sesión exitoso', user });
      } else {
        // Credenciales incorrectas
        res.status(401).json({ error: 'Credenciales incorrectas' });
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
};
