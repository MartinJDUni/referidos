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
          e.id, 
          e.name AS nombre_empleado, 
          r.rol AS rol_empleado, 
          SUM(CASE WHEN et.status = 1 THEN et.total ELSE 0 END) AS total_tareas,
          SUM(CASE WHEN c.statusTask = 'ACEPTADO' THEN 1 ELSE 0 END) AS tareas_aceptadas
      FROM 
          employeespertask et
      JOIN 
          employee e ON e.id = et.idEmployee
      JOIN 
          role r ON e.idRol = r.id
      LEFT JOIN
          customerperemployee c ON e.id = c.idEmployee
      GROUP BY 
          e.id, e.name, r.rol;
    `;
      const [rows] = await connection.execute(query);
      connection.end();
      res.status(200).json({ data: rows });
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
  }
  else if (req.method === 'PUT') {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID no proporcionado' });
    }

    const connection = await connectToDatabase();

    try {
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
};
