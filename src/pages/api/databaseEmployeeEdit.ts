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
    const { id, name, password, email, state } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID no proporcionado' });
    }

    let connection;

    try {
      console.log('Iniciando conexión a la base de datos...');
      connection = await connectToDatabase();

      if (state !== undefined) {
        const updateStateQuery = 'UPDATE employee SET state = ? WHERE Id = ?';
        await connection.execute(updateStateQuery, [state, id]);
        res.status(200).json({ message: `Estado actualizado a ${state} con éxito` });
      } else {
        const updateQuery = 'UPDATE employee SET Name = ?, Password = ?, Email = ? WHERE Id = ?';
        console.log('Update Query:', updateQuery);
        await connection.execute(updateQuery, [name, password, email, id]);
        res.status(200).json({ message: 'Datos actualizados con éxito' });
      }
      
      console.log('Operación exitosa.');
    } catch (error) {
      console.error('Error al actualizar en la base de datos:', error);
      res.status(500).json({ error: `Error al actualizar en la base de datos: ${error.message}` });
    } finally {
      if (connection) {
        await connection.end();
        console.log('Conexión cerrada.');
      }
    }
  }
};
