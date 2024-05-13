import { createConnection } from 'mysql2/promise';

export async function connectToDatabase() {
  let connection = null;

  try {
    connection = await createConnection({
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

export default async (req: any, res: any) => {
  if (req.method === 'GET') {
    const connection = await connectToDatabase();

    try {
      const query = 'SELECT id, rol FROM role'; 
      const [rows] = await connection.execute(query);
      connection.end();
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido.' });
  }
};
