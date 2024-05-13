import { OkPacket, ProcedureCallPacket, ResultSetHeader, RowDataPacket, createConnection } from 'mysql2/promise';

export default async (req: { method: string; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { data?: OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket; error?: string; }): void; new(): any; }; }; }) => {
    if (req.method === 'GET') {
        const connection = await connectToDatabase();

        try {
            const query = `
          SELECT
            e.Id AS EmployeeId,
            e.Name AS EmployeeName,
            COUNT(DISTINCT cpe.Id) AS TaskCount,
            GROUP_CONCAT(DISTINCT cpe.Id) AS TaskIds
          FROM customerperemployee cpe
          INNER JOIN employee e ON cpe.Idemployee = e.Id
          INNER JOIN statusTask st ON cpe.Idstatetask = st.Id
          WHERE st.State = 'ACEPTADO'
          GROUP BY e.Id;
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

