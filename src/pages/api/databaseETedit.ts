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


export default async (req: { method: string; body: { id: any; goal: any; start: any; final: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; message?: string; }): void; new(): any; }; }; }) => {
  if (req.method === 'PUT') {
    const { id, goal, start, final } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID not provided' });
    }

    let connection;

    try {
      console.log('Initializing database connection...');
      connection = await connectToDatabase();

      // Update goal, start, and final
      const updateQuery = 'UPDATE employeespertask SET Goal = ?, Startdate = ?, Finaldate = ? WHERE Id = ?';
      console.log('Update Query:', updateQuery);
      await connection.execute(updateQuery, [goal, start, final, id]);

      res.status(200).json({ message: 'Data updated successfully' });

      console.log('Operation successful.');
    } catch (error) {
      console.error('Error updating in the database:', error);
      res.status(500);
    } finally {
      if (connection) {
        await connection.end();
        console.log('Connection closed.');
      }
    }
  }
};
