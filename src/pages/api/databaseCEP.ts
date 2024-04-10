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
    const { id } = req.query; // Obtiene el ID de la solicitud GET

    if (!id) {
      return res.status(400).json({ error: 'Debes proporcionar un ID' });
    }

    const connection = await connectToDatabase();

    try {
      // Realiza la consulta SQL para obtener los comentarios relacionados con el ID proporcionado
      const query = `
        SELECT c.Id, c.Idcustomerperemployee, c.comment, c.state
        FROM commentperemployee c
        WHERE c.Idcustomerperemployee = ?;
      `;

      const [rows] = await connection.execute(query, [id]);
      connection.end();
      res.status(200).json({ data: rows });
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
  } else if (req.method === 'PUT') {
    const { commentId, newState } = req.body;

    if (!commentId || newState === undefined) {
      return res.status(400).json({ error: 'Se requieren commentId y newState' });
    }

    const connection = await connectToDatabase();

    try {
      // Realiza la consulta SQL para actualizar el estado del comentario
      const updateQuery = `
        UPDATE commentperemployee
        SET state = ?
        WHERE Id = ?;
      `;

      await connection.execute(updateQuery, [newState, commentId]);
      connection.end();

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error al actualizar el estado en la base de datos:', error);
      res.status(500).json({ error: 'Error al actualizar el estado en la base de datos' });
    }
  }
};
