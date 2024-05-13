import { OkPacket, ProcedureCallPacket, ResultSetHeader, RowDataPacket, createConnection } from 'mysql2/promise';

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

export default async (req: { method: string; body: { name?: any; password?: any; email?: any; idRol?: any; id?: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { data?: OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket; error?: string; message?: string; insertedId?: any; }): void; new(): any; }; }; }) => {
  if (req.method === 'GET') {
    const connection = await connectToDatabase();

    try {
      const query = `
      SELECT e.id, e.name, e.email, e.password, e.status, r.rol AS roleName
      FROM employee e
      INNER JOIN role r ON e.idRol = r.id;
    `;
      const [rows] = await connection.execute(query);
      connection.end();
      res.status(200).json({ data: rows });
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
  } else if (req.method === 'POST') {
    const { name, password, email, idRol } = req.body;

    if (!name || !password || !email) {
      res.status(400).json({ error: 'Faltan datos obligatorios' });
      return;
    }

    const connection = await connectToDatabase();

    try {
      const query = 'INSERT INTO employee (name, password, email, idRol, status) VALUES (?, ?, ?, ?, ?)';
      const [result] = await connection.execute(query, [name, password, email, idRol || 1, 1]);
      connection.end();
      if ('insertId' in result) {
        res.status(201).json({ message: 'Datos insertados correctamente', insertedId: result.insertId });
      } else {
        console.error('Error al insertar datos en la base de datos:', result);
        res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
      }
    } catch (error) {
      console.error('Error al insertar datos en la base de datos:', error);
      res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
    }
  } else if (req.method === 'PUT') {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID no proporcionado' });
    }

    const connection = await connectToDatabase();

    try {
      const updateQuery = `
        UPDATE employee
        SET status = 0
        WHERE id = ?;
      `;
      await connection.execute(updateQuery, [id]);

      connection.end();
      res.status(200).json({ message: 'Reactivado con éxito' });
    } catch (error) {
      console.error('Error al reactivar en la base de datos:', error);
      res.status(500).json({ error: 'Error al reactivar en la base de datos' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido.' });
  }
};
