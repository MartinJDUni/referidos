import { OkPacket, ProcedureCallPacket, ResultSetHeader, RowDataPacket, createConnection } from 'mysql2/promise';

export async function connectToDatabase() {
  let connection = null; // Variable definida fuera del bloque try

  try {
    connection = await createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'refb',
    });
    //console.log('Conexión exitosa a la base de datos MySQL2');
    return connection;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw new Error('Error al conectar con la base de datos');
  }
}

export default async (req: { method: string; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { data?: OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket; error?: string; }): void; new(): any; }; }; }) => {
  if (req.method === 'GET') {
    const connection = await connectToDatabase();

    try {
      const query = `
        SELECT
            e.id AS idRol,
            e.rol AS nombreRol,
            SUM(et.total) AS totalTareas
        FROM
            role e
        JOIN
            task t ON e.id = t.idRol
        JOIN
            subTask et ON t.id = et.idTask
        WHERE
	          et.status = 1 
        GROUP BY
            e.id, e.rol;
      `;
      const [rows] = await connection.execute(query);
      connection.end();
      res.status(200).json({ data: rows });
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
  }
};




