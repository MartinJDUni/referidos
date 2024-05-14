import { createConnection } from 'mysql2/promise';

export async function connectToDatabase() {
  let connection = null; // Variable definida fuera del bloque try

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

export default async (req: { method: string; body: { id: any; task: any; description: any; }; },res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; message?: string; }): void; new(): any; }; }; }) => {
  if (req.method === 'PUT') {
    const { id, task, description } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID not provided' });
    }

    let connection;

    try {
      console.log('Initializing database connection...');
      connection = await connectToDatabase();

      // Update name, description, and state (assuming state is an INT column)
      const updateQuery = 'UPDATE task SET task = ?, description = ?, status = ? WHERE id = ?;';
      await connection.execute(updateQuery, [task, description, 1, id]);
      res.status(200).json({ message: 'Data updated successfully' });

      console.log('La tarea se ha actualizado.');
    } catch (error) {
        console.error('Error updating in the database:', error);
        res.status(500);
      }
  }
};
