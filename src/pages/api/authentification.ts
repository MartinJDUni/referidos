import { createConnection, FieldPacket, OkPacket, RowDataPacket } from 'mysql2/promise';

// Define la interfaz para el objeto User
interface User {
  id: number;
  name: string;
  role: string;
}

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

export default async (req: { method: string; body: { email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; message?: string; authenticatedUser?: User }): void; new(): any; }; }; }) => {
  let connection = null;

  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
      }

      connection = await connectToDatabase();

      const [userRows, _fields] = await connection.execute<RowDataPacket[]>(
        'SELECT id, name, idRol FROM employee WHERE email = ? AND password = ?',
        [email, password]
      );

      if (userRows.length === 0) {
        return res.status(401).json({ error: 'Por favor ingrese correctamente los datos' });
      }

      const authenticatedUser: User = {
        id: userRows[0].id,
        name: userRows[0].name,
        role: userRows[0].idRol,
      };

      console.log('Usuario autenticado:', authenticatedUser);
      res.status(200).json({ message: 'Autenticación exitosa', authenticatedUser });
    } catch (error) {
      console.error('Error al autenticar el usuario:', error);
      res.status(500).json({ error: 'Error al autenticar el usuario' });
    } finally {
      try {
        if (connection) {
          await connection.end();
          console.log('Conexión cerrada');
        }
      } catch (error) {
        console.error('Error al cerrar la conexión con la base de datos:', error);
      }
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
};
