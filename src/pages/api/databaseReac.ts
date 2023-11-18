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
  if (req.method === 'PUT') {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID no proporcionado' });
    }

    const connection = await connectToDatabase();

    try {
      // Actualiza el estado a 1 para reactivar en lugar de eliminar físicamente
      const updateQuery = `
        UPDATE employeespertask
        SET state = 1
        WHERE Id = ?;
      `;
      await connection.execute(updateQuery, [id]);

      connection.end();
      res.status(200).json({ message: 'Reactivado con éxito' });
    } catch (error) {
      console.error('Error al reactivar en la base de datos:', error);
      res.status(500).json({ error: 'Error al reactivar en la base de datos' });
    }
  }
};
