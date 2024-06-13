import { createConnection } from "mysql2/promise";

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
  req: { method: string, body: { idEmployee: number, idSubTask: number, date: string } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: {
        (arg0: {
          message?: string;
          error?: string;
        }): void;
        new (): any;
      };
    };
  }
) => {
  if (req.method === "POST") {
    const connection = await connectToDatabase();

    const { idEmployee, idSubTask, date } = req.body;

    if (!idEmployee || !idSubTask || !date) {
      res.status(400).json({ error: "Datos incompletos. Se requieren idEmployee, idSubTask y date." });
      return;
    }

    try {
      const queryInsert = `
        INSERT INTO employeespertask (idEmployee, idSubTask, date, status)
        VALUES (?, ?, ?, 1);
      `;
      const values = [idEmployee, idSubTask, date];

      await connection.execute(queryInsert, values);

      connection.end();

      res.status(201).json({ message: "Datos insertados exitosamente" });
    } catch (error) {
      console.error("Error al insertar datos en la base de datos:", error);
      res.status(500).json({ error: "Error al insertar datos en la base de datos" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
};
