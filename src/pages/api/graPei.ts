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
    console.log('Conexión exitosa a la base de datos MySQL');
    return connection;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw new Error('Error al conectar con la base de datos');
  }
}


export default async (req: { method: string; body: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { data?: OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket; error?: string; message?: string; }): void; new(): any; }; }; }) => {
    if (req.method === 'GET') {
  const connection = await connectToDatabase();

<<<<<<< Updated upstream:src/pages/api/databaseET.ts
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
      JOIN task t ON et.Idtask = t.Id;            
=======
    try {
      const query = `
        SELECT 
            e.id AS id_empleado, 
            e.name AS nombre_empleado, 
            COUNT(CASE WHEN c.statusTask = 'ACEPTADO' THEN 1 ELSE NULL END) AS total_tareas_aceptadas
        FROM 
            employee e
        JOIN 
            customerperemployee c ON e.id = c.idEmployee
        GROUP BY 
            e.id, e.name;
>>>>>>> Stashed changes:src/pages/api/graPei.ts
    `;
    const [rows] = await connection.execute(query);
    connection.end();
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
<<<<<<< Updated upstream:src/pages/api/databaseET.ts
}
else if (req.method === 'PUT') {
        const { id } = req.body;
    
        if (!id) {
          return res.status(400).json({ error: 'ID no proporcionado' });
        }
    
        const connection = await connectToDatabase();
    
        try {
          // Actualiza el estado a 0 en lugar de eliminar físicamente
          const updateQuery = `
            UPDATE employeespertask
            SET state = 0
            WHERE Id = ?;
          `;
          await connection.execute(updateQuery, [id]);
    
          connection.end();
          res.status(200).json({ message: 'Estado actualizado con éxito' });
        } catch (error) {
          console.error('Error al actualizar el estado en la base de datos:', error);
          res.status(500).json({ error: 'Error al actualizar el estado en la base de datos' });
        }
      }
=======
>>>>>>> Stashed changes:src/pages/api/graPei.ts
};