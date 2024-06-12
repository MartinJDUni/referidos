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


export default async (req: { method: string; query: { employeeId: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { data?: OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket; error?: string; }): void; new(): any; }; }; }) => {
    if (req.method === 'GET') {
      const connection = await connectToDatabase();
  
      try {
        const { employeeId } = req.query;
        const query = `
        SELECT cpe.id, cl.name AS ClientName, cpe.statusTask, cpe.date,cpe.status
        FROM customerperemployee cpe
        INNER JOIN client cl ON cpe.Idclient = cl.Id
        INNER JOIN employee e ON cpe.idEmployee = e.id
        WHERE e.id = ?;
        `;
        const [rows] = await connection.execute(query, [employeeId]);
        connection.end();
        res.status(200).json({ data: rows });
      } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
      }
    }
  };
  