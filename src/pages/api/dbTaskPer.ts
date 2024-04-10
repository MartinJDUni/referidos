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


export default async (req: { method: string; query: { employeeId: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { data?: OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket; error?: string; }): void; new(): any; }; }; }) => {
    if (req.method === 'GET') {
      const connection = await connectToDatabase();
  
      try {
        // Agrega un parámetro para filtrar por el Id del empleado
        const { employeeId } = req.query;
  
        // Realiza una consulta SQL que incluye uniones y un filtro para obtener los nombres
        const query = `
          SELECT cpe.Id, cl.Name AS ClientName, e.Name AS EmployeeName, st.State AS StateTaskName, cpe.state, cpe.date
          FROM customerperemployee cpe
          INNER JOIN client cl ON cpe.Idclient = cl.Id
          INNER JOIN employee e ON cpe.Idemployee = e.Id
          INNER JOIN statetask st ON cpe.Idstatetask = st.Id
          WHERE cpe.Idemployee = ?;  -- Filtra por el Id del empleado
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
  