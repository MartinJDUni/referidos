import {
  OkPacket,
  RowDataPacket,
  ResultSetHeader,
  createConnection,
} from "mysql2/promise";

interface EmployeeData {
  id_empleado: number;
  nombre_empleado: string;
  rol_empleado: string;
  total_tareas: number;
  tareas_aceptadas: number;
}

export async function connectToDatabase() {
  try {
    const connection = await createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "refb",
    });
    return connection;
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    throw new Error("Error al conectar con la base de datos");
  }
}

export default async (
  req: { method: string; body: { id: any } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: {
        (arg0: {
          data?: EmployeeData[];
          error?: string;
          message?: string;
        }): void;
        new (): any;
      };
    };
  }
) => {
  if (req.method === "GET") {
    const connection = await connectToDatabase();

    try {
      const queryTotalTareas = `
        SELECT 
            e.id AS id_empleado,
            e.name AS nombre_empleado,
            r.rol AS rol_empleado,
            SUM(s.total) AS total_tareas
        FROM 
            employee e
        JOIN 
            role r ON e.idRol = r.id
        JOIN 
            employeespertask ep ON e.id = ep.idEmployee
        JOIN 
            subtask s ON ep.idSubTask = s.id
        WHERE 
            e.status = 1 
            AND ep.status = 1 
            AND s.status = 1 
        GROUP BY 
            e.id, e.name, r.rol;
      `;
      const [rowsTotalTareas] = await connection.execute<RowDataPacket[]>(
        queryTotalTareas
      );

      const queryTareasAceptadas = `
       SELECT 
            e.id AS id_empleado, 
            SUM(CASE WHEN c.statusTask = 'ACEPTADO' THEN 1 ELSE 0 END) AS tareas_aceptadas
        FROM 
            employee e
        JOIN 
            customerperemployee c ON e.id = c.idEmployee
        GROUP BY 
            e.id;
      `;
      const [rowsTareasAceptadas] = await connection.execute<RowDataPacket[]>(
        queryTareasAceptadas
      );
      connection.end();
      const combinedData: EmployeeData[] = rowsTotalTareas.map((employee) => {
        const matchingTasks = rowsTareasAceptadas.find(
          (tasks) => tasks.id_empleado === employee.id_empleado
        );
        return {
          id_empleado: employee.id_empleado,
          nombre_empleado: employee.nombre_empleado,
          rol_empleado: employee.rol_empleado,
          total_tareas: employee.total_tareas,
          tareas_aceptadas: matchingTasks ? matchingTasks.tareas_aceptadas : 0,
        };
      });
      res.status(200).json({ data: combinedData });
    } catch (error) {
      console.error("Error al consultar la base de datos:", error);
      res.status(500).json({ error: "Error al consultar la base de datos" });
    }
  }
};
