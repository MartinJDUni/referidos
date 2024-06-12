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
    return connection;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw new Error('Error al conectar con la base de datos');
  }
}


export default async (req: { method: string; body: { id: any; }; },
  res: {
    status: (arg0: number) => {
      (): any; new(): any; json:
        { (arg0: { data?: OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket; error?: string; message?: string; }): void; new(): any; };
    };
  }) => {
  if (req.method === 'GET') {
    const connection = await connectToDatabase();

    try {
      const query = `
        SELECT
            date,
            COUNT(*) AS cantidad_aceptados
        FROM
            customerperemployee
        WHERE
            statusTask = 'ACEPTADO'
            AND YEAR(date) = YEAR(CURDATE()) -- Filtra por el año actual
        GROUP BY
            date;
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
