import { createConnection } from 'mysql2/promise';

export async function connectToDatabase() {
  let connection = null;

  try {
    connection = await createConnection({
      host: '34.135.49.190',
      user: 'martin',
      password: 'pruebasUni',
      database: 'referidos',
    });
    console.log('Conexión exitosa a la base de datos MySQL');
    return connection;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw new Error('Error al conectar con la base de datos');
  }
}

export default async (req: { method: string; body: { Idclient: any; Idemployee: any; Idstatetask?: 3 | undefined; state?: 1 | undefined; date?: string | undefined; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; message?: string; clientId?: any; }): void; new(): any; }; }; }) => {
  if (req.method === 'POST') {
    const { Idclient, Idemployee, Idstatetask = 3, state = 1, date = new Date().toISOString() } = req.body;

    if (!Idclient || !Idemployee) {
      return res.status(400).json({ error: 'Los campos Idclient e Idemployee son obligatorios.' });
    }

    const connection = await connectToDatabase();

    try {
      const addEmployeeQuery = `
        INSERT INTO customerperemployee (Idclient, Idemployee, Idstatetask, state, date)
        VALUES (?, ?, ?, ?, ?);
      `;
      const [addResult] = await connection.execute(addEmployeeQuery, [Idclient, Idemployee, Idstatetask, state, date]);

      if ('affectedRows' in addResult && addResult.affectedRows > 0) {
        const clientId = addResult.insertId;
        console.log(`Registro agregado correctamente. ID del nuevo registro: ${clientId}`);
        res.status(200).json({ message: 'Registro agregado correctamente.', clientId });
      } else {
        console.error('Error al agregar el registro a la base de datos.');
        res.status(500).json({ error: 'Error al agregar el registro a la base de datos.' });
      }
    } catch (error) {
      console.error('Error al agregar el registro:', error);
      res.status(500).json({ error: 'Error al agregar el registro.' });
    } finally {
      connection.end();
    }
  } else {
    res.status(405).json({ error: 'Método no permitido.' });
  }
};
