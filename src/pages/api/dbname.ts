import { RowDataPacket, createConnection } from 'mysql2/promise';

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

export default async (req: { method: string; body: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; message?: string; authenticatedUser?: { id: any; name: any; role: any; }; }): void; new(): any; }; }; }) => {
  if (req.method === 'POST') {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
      }

      const connection = await connectToDatabase();

      const userQuery = `
        SELECT Id, Name, Idrole
        FROM employee
        WHERE id = ?;
      `;
      const [userRows] = await connection.execute<RowDataPacket[]>(userQuery, [id]);

      if (userRows.length === 0) {
        return res.status(401).json({ error: 'Por favor ingrese correctamente los datos' });
      }

      const authenticatedUser = {
        id: userRows[0].Id,
        name: userRows[0].Name,
        role: userRows[0].Idrole,
      };

      res.status(200).json({ message: 'Autenticación exitosa', authenticatedUser });
    } catch (error) {
      console.error('Error al autenticar el usuario:', error);
      res.status(500).json({ error: 'Error al autenticar el usuario' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
};
