// subtask.js
import { OkPacket, createConnection } from 'mysql2/promise';

// Función para conectar a la base de datos
export async function connectToDatabase() {
  try {
    const connection = await createConnection({
      host: 'localhost', // Cambia esto por tu host de la base de datos
      user: 'root', // Cambia esto por tu usuario de la base de datos
      password: '', // Cambia esto por tu contraseña de la base de datos
      database: 'refb', // Cambia esto por el nombre de tu base de datos
    });
    console.log('Conexión exitosa a la base de datos MySQL');
    return connection;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw new Error('Error al conectar con la base de datos');
  }
}

export default async (req: { method: string; body: { idTask: any; subTask: any; total: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; message?: string; insertedId?: number; }): void; new(): any; }; }; }) => {
  if (req.method === 'POST') {
    const { idTask, subTask, total } = req.body;

    if (!idTask || !subTask || total === undefined) {
      res.status(400).json({ error: 'Faltan datos obligatorios' });
      return;
    }

    const connection = await connectToDatabase();

    try {
      const query = 'INSERT INTO subTask (idTask, subTask, total, status) VALUES (?, ?, ?, 1)';
      const [result] = await connection.execute<OkPacket>(query, [idTask, subTask, total]);
      connection.end();

      if (result.insertId) {
        res.status(201).json({ message: 'Subtarea insertada correctamente', insertedId: result.insertId });
      } else {
        console.error('Error al insertar datos en la base de datos:', result);
        res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
      }
    } catch (error) {
      console.error('Error al insertar datos en la base de datos:', error);
      res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido.' });
  }
};
