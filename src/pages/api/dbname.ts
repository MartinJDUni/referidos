import { createConnection } from 'mysql2/promise';

export async function connectToDatabase() {
  try {
    const connection = await createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Cambia esto por la contraseña de tu base de datos
      database: 'referidos', // Cambia esto por el nombre de tu base de datos 
    });
    return connection;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw new Error('Error al conectar con la base de datos');
  }
}

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { id } = req.body;

      if (!id ) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
      }

      const connection = await connectToDatabase();

      const userQuery = `
        SELECT Id, Name, Idrole
        FROM employee
        WHERE id = ?;
      `;
      const [userRows] = await connection.execute(userQuery, [id]);

      if (userRows.length === 0) {
        return res.status(401).json({ error: 'Por favor ingrese correctamente los datos' });
      }

      const authenticatedUser = {
        id: userRows[0].Id,
        name: userRows[0].Name,
        role: userRows[0].Idrole,
      };
      console.log(authenticatedUser);

      res.status(200).json({ message: 'Autenticación exitosa', authenticatedUser });
    } catch (error) {
      console.error('Error al autenticar el usuario:', error);
      res.status(500).json({ error: 'Error al autenticar el usuario' });
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
