import { RowDataPacket, createConnection } from 'mysql2/promise';

interface EmployeeData {
  total_aceptados: number;
  total_columna_total: number;
}

export async function connectToDatabase() {
  try {
    const connection = await createConnection({
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
      { (arg0: { data?: EmployeeData[]; error?: string; message?: string; }): void; new(): any; };
    };
  }) => {
  if (req.method === 'GET') {
    const connection = await connectToDatabase();

    try {
      const queryTotalTareas = `
        SELECT 
            COUNT(*) AS total_aceptados
        FROM 
            customerperemployee
        WHERE 
            statusTask = 'ACEPTADO';
      `;
      const [rowsTotalTareas] = await connection.execute<RowDataPacket[]>(queryTotalTareas);
      const total_aceptados = rowsTotalTareas[0]?.total_aceptados || 0;

      const queryTotalColumnaTotal = `
        SELECT 
            SUM(total) AS total_columna_total
        FROM 
            employeespertask a
        JOIN
            subtask b ON a.idSubTask = b.id
        WHERE
            a.status = 1 AND b.status = 1;  
      `;
      const [rowsTotalColumnaTotal] = await connection.execute<RowDataPacket[]>(queryTotalColumnaTotal);
      const total_columna_total = rowsTotalColumnaTotal[0]?.total_columna_total || 0;

      connection.end();
      res.status(200).json({ data: [{ total_aceptados, total_columna_total }] });
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
  }
};
