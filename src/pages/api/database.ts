import { OkPacket, ProcedureCallPacket, ResultSetHeader, RowDataPacket, createConnection } from 'mysql2/promise';

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
// Endpoint principal
export default async (req: { method: string; body: { task: any; description: any; status: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { data?: OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket; error?: string; message?: string; insertedId?: any; }): void; new(): any; }; }; }) => {
  if (req.method === 'GET') {
    // Manejo de solicitud GET
    try {
      const connection = await connectToDatabase();
      const [rows] = await connection.execute('SELECT * FROM task');
      connection.end();
      res.status(200).json({ data: rows });
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
  } else if (req.method === 'POST') {
    // Manejo de solicitud POST
    const { task, description, status } = req.body;

    if (!task || !description) {
      res.status(400).json({ error: 'Faltan datos obligatorios: task y description son obligatorios' });
      return;
    }

    try {
      const connection = await connectToDatabase();
      const [result] = await connection.execute(
        'INSERT INTO task (task, description, status) VALUES (?, ?, ?)',
        [task, description, status || 1] // Utilizamos status o establecemos 1 como valor predeterminado
      );
      connection.end();
      res.status(201).json({ message: 'Tarea creada exitosamente', insertedId: result.insertId });
    } catch (error) {
      console.error('Error al insertar datos en la base de datos:', error);
      res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
    }
  } else {
    // Manejo de otros métodos HTTP no soportados
    res.status(405).json({ error: 'Método HTTP no permitido' });
  }
};
