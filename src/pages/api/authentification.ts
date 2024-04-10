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
  let connection = null; // Variable definida fuera del bloque try

  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
      }

      connection = await connectToDatabase(); // Establecer la conexión y asignarla a la variable connection

      const userQuery = `
        SELECT Id, Name, Idrole
        FROM employee
        WHERE email = ? AND password = ?;
      `;
      const [userRows] = await connection.execute(userQuery, [email, password]);

      if (userRows.length === 0) {
        return res.status(401).json({ error: 'Por favor ingrese correctamente los datos' });
      }

      const authenticatedUser = {
        id: userRows[0].Id,
        name: userRows[0].Name,
        role: userRows[0].Idrole,
      };

      console.log('Usuario autenticado:', authenticatedUser);
      res.status(200).json({ message: 'Autenticación exitosa', authenticatedUser });
    } catch (error) {
      console.error('Error al autenticar el usuario:', error);
      res.status(500).json({ error: 'Error al autenticar el usuario' });
    } finally {
      try {
        if (connection) {
          await connection.end();
          console.log('Conexión cerrada');
        }
      } catch (error) {
        console.error('Error al cerrar la conexión con la base de datos:', error);
      }
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
};
