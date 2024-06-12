import { OkPacket, ProcedureCallPacket, ResultSetHeader, RowDataPacket, createConnection } from 'mysql2/promise';

interface EmployeeData {
  id_EmpPerTask: number;
  subtareas: string;
  tareas: string;
  total_tareas: number;
  tareas_aceptadas: number;
}

interface SubtaskData {
  id_empleado: number;
  sub_tarea: string;
  total_aceptados: number;
}

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

export default async (
  req: { method: string; query: { employeeId: any } },
  res: {
    status: (arg0: number) => {
      json: (arg0: { data?: EmployeeData[] | SubtaskData[]; error?: string; message?: string }) => void;
    };
  }
) => {
  if (req.method === 'GET') {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({ error: 'ID del empleado no proporcionado' });
    }

    let connection;
    try {
      connection = await connectToDatabase();

      const queryTotalTareas = `
        SELECT 
          e.id AS id_empleado,
          ep.id AS name_Sub,
          e.name AS nombre_empleado,
          s.subTask AS subtask,
          r.rol AS rol_empleado,
          s.total AS total_tareas,
          m.task AS tarea
        FROM 
          employee e
        JOIN 
          role r ON e.idRol = r.id
        JOIN 
          employeespertask ep ON e.id = ep.idEmployee
        JOIN 
          subtask s ON ep.idSubTask = s.id
        JOIN 
          task m ON s.idTask = m.id
        WHERE 
          e.id = ? AND
          e.status = 1 AND 
          ep.status = 1 AND 
          s.status = 1;
      `;
      const [rowsTotalTareas] = await connection.execute<RowDataPacket[]>(queryTotalTareas, [employeeId]);
      const queryTareasAceptadas = `
        SELECT 
            e.id AS id_empleado,
            s.subTask AS sub_tarea,
            COUNT(*) AS total_aceptados
        FROM 
            employee e
        JOIN 
            employeespertask ep ON e.id = ep.idEmployee
        JOIN 
            subtask s ON ep.idSubTask = s.id
        JOIN 
            customerperemployee c ON ep.id = c.idEmpTask
        WHERE 
            c.statusTask = 'ACEPTADO' AND
            e.id = ?
        GROUP BY 
            e.id, s.subTask;
      `;
      const [rowsTareasAceptadas] = await connection.execute<RowDataPacket[]>(queryTareasAceptadas, [employeeId]);

      const combinedData: EmployeeData[] = rowsTotalTareas.map((employee) => {
        const matchingTasks = rowsTareasAceptadas.find(
          (tasks) => tasks.sub_tarea === employee.subtask
        );
        return {
          id_EmpPerTask: employee.name_Sub,
          tareas: employee.tarea,
          subtareas: employee.subtask,
          total_tareas: employee.total_tareas,
          tareas_aceptadas: matchingTasks ? matchingTasks.total_aceptados : 0,
        };
      });
      res.status(200).json({ data: combinedData });
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
};
