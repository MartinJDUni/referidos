import { OkPacket, ProcedureCallPacket, ResultSetHeader, RowDataPacket, createConnection } from 'mysql2/promise';

export async function connectToDatabase() {
  let connection = null; // Variable definida fuera del bloque try

  try {
    connection = await createConnection({
      host: '34.135.49.190',
      user: 'martin',
      password: 'pruebasUni', // Reemplaza 'tu_contraseña' con la contraseña real del usuario 'martin'
      database: 'referidos',
    });
    console.log('Conexión exitosa a la base de datos MySQL');
    return connection;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw new Error('Error al conectar con la base de datos');
  }
}


export default async (req: { method: string; query: { employeeId: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; data?: OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket; }): void; new(): any; }; }; }) => {
  if (req.method === 'GET') {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({ error: 'ID del empleado no proporcionado' });
    }

    const connection = await connectToDatabase();

    try {
      // Realiza la consulta SQL para obtener datos de empleado y nombre del rol
      const query = `
        SELECT
          et.Id,
          e.Id AS EmployeeId,
          e.Name AS EmployeeName,
          t.Name AS TaskName,
          et.Goal,
          et.Startdate,
          et.Finaldate,
          et.state
        FROM employeespertask et
        JOIN employee e ON et.Idemployee = e.Id
        JOIN task t ON et.Idtask = t.Id
        WHERE e.Id = ?;
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
