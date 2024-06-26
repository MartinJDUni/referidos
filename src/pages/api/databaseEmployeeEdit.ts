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


export default async (req: { method: string; body: { id: any; name: any; password: any; email: any; state: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; message?: string; }): void; new(): any; }; }; }) => {
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
      res.status(500);
    } finally {
      if (connection) {
        await connection.end();
        console.log('Conexión cerrada.');
      }
    }
  }
};
