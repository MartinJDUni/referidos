import { createConnection } from 'mysql2/promise';

export async function connectToDatabase() {
  let connection = null; // Variable definida fuera del bloque try

  try {
    connection = await createConnection({
      host: '34.135.49.190',
      user: 'martin',
      password: 'pruebasUni', // Reemplaza 'tu_contraseña' con la contraseña real del usuario 'martin'
      database: 'referidos',
    });
    console.log('Conexión exitosa a la base de datos MySQL');
    return connection;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw new Error('Error al conectar con la base de datos');
  }
}


export default async (req, res) => {
  if (req.method === 'GET') {
    const { email, password } = req.query;

    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const connection = await connectToDatabase();

    try {
      // Realiza la consulta SQL deseada
      const [userRows] = await connection.execute('SELECT * FROM employee WHERE email = ? AND password = ?', [email, password]);

      if (userRows.length === 0) {
        // No se encontró el usuario con las credenciales proporcionadas
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }

      // Usuario autenticado exitosamente
      const authenticatedUser = {
        id: userRows[0].id,
        name: userRows[0].name,
        // Agrega otros campos que necesites
      };

      res.status(200).json({ message: 'Autenticación exitosa', authenticatedUser });
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    } finally {
      try {
        if (connection) {
          await connection.end();
        }
      } catch (error) {
        console.error('Error al cerrar la conexión con la base de datos:', error);
      }
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
};
