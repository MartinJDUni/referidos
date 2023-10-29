import { createConnection } from 'mysql2/promise';

export async function connectToDatabase() {
  const connection = await createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Cambia esto por la contraseña de tu base de datos
    database: 'referidos', // Cambia esto por el nombre de tu base de datos
  });
  return connection;
}

export default async (req, res) => {
  if (req.method === 'GET') {
    const connection = await connectToDatabase();

    try {
      // Realiza la consulta SQL para obtener datos de empleado y nombre del rol
      const query = `
              SELECT e.Id, e.Name, e.Password, e.Email, e.state, r.Name AS RoleName
              FROM employee e
              INNER JOIN role r ON e.Idrole = r.Id;
          `;
      const [rows] = await connection.execute(query);
      connection.end();
      res.status(200).json({ data: rows });
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
  }
};

