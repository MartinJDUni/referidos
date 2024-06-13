import { NextApiRequest, NextApiResponse } from 'next';
import { createConnection } from 'mysql2/promise';

// Función para conectar a la base de datos
async function connectToDatabase() {
  try {
    const connection = await createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'refb',
    });
    console.log('Conexión exitosa a la base de datos MySQL');
    return connection;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw new Error('Error al conectar con la base de datos');
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método no permitido.' });
    return;
  }

  let connection;
  try {
    connection = await connectToDatabase();

    const query = 'SELECT id, subTask FROM subtask WHERE status = 1'; // Incluye 'id' y 'subTask'
    const [rows] = await connection.execute(query);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener IDs de las subtareas de la base de datos:', error);
    res.status(500).json({ error: 'Error al obtener IDs de las subtareas de la base de datos' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export default handler;
