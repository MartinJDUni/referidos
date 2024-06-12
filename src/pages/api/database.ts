import { OkPacket, RowDataPacket, createConnection } from 'mysql2/promise';
import { NextApiRequest, NextApiResponse } from 'next';

// Función para conectarse a la base de datos
export async function connectToDatabase() {
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

// Función para manejar las solicitudes GET
async function handleGetRequest(res: NextApiResponse) {
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM task');
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Función para manejar las solicitudes POST
async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { task, idRol, status, percentages } = req.body;

  if (!task || !idRol) {
    res.status(400).json({ error: 'Faltan datos obligatorios: task e idRol son obligatorios' });
    return;
  }

  let connection;
  try {
    connection = await connectToDatabase();
    const [result] = await connection.execute<OkPacket>(
      'INSERT INTO task (task, status, idRol, percentages) VALUES (?, ?, ?, ?)',
      [task, status ?? 1, idRol, percentages]
    );
    res.status(201).json({ message: 'Tarea creada exitosamente', insertedId: result.insertId });
  } catch (error) {
    console.error('Error al insertar datos en la base de datos:', error);
    res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Endpoint principal
export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      await handleGetRequest(res);
      break;
    case 'POST':
      await handlePostRequest(req, res);
      break;
    default:
      res.status(405).json({ error: 'Método HTTP no permitido' });
      break;
  }
};
