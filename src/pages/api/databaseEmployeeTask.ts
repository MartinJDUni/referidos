import { OkPacket, ProcedureCallPacket, ResultSetHeader, RowDataPacket, createConnection } from 'mysql2/promise';

export async function connectToDatabase() {
    const connection = await createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'refb', // Cambia esto por el nombre de tu base de datos
    });
    return connection;
}

export default async (req: { method: string; body: { Idemployee: any; Idtask: any; Goal: any; Startdate: any; Finaldate: any; state: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { employees?: OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket; tasks?: OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket; error?: string; message?: string; insertedId?: any; }): void; new(): any; }; }; }) => {
    if (req.method === 'GET') {
        const connection = await connectToDatabase();

        try {
            // Realiza la consulta SQL para obtener solo el ID del empleado
            const employeeQuery = `
                SELECT Id, Name
                FROM employee;
            `;
            const [employeeRows] = await connection.execute(employeeQuery);

            // SQL query to fetch task data
            const taskQuery = `
                SELECT Id, Name
                FROM task;
            `;
            const [taskRows] = await connection.execute(taskQuery);

            connection.end();

            res.status(200).json({
                employees: employeeRows,
                tasks: taskRows,
            });
        } catch (error) {
            console.error('Error al consultar la base de datos:', error);
            res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
    } else if (req.method === 'POST') {
        const { Idemployee, Idtask, Goal, Startdate, Finaldate, state } = req.body; // Asume que estás enviando estos datos en el cuerpo de la solicitud POST.

        if (!Idemployee || !Idtask || !Goal || !Startdate || !Finaldate || state === undefined) {
            res.status(400).json({ error: 'Faltan datos obligatorios' });
            return;
        }

        const connection = await connectToDatabase();

        try {
            // Parsea Startdate como un objeto Date
            const startDate = new Date(Startdate);
            const finaldate = new Date(Finaldate);

            // Realiza la inserción de datos en la base de datos
            const [result] = await connection.execute(
                'INSERT INTO employeespertask (Idemployee, Idtask, Goal, Startdate, Finaldate, state) VALUES (?, ?, ?, ?, ?, ?)',
                [Idemployee, Idtask, Goal, startDate, finaldate, state]
            );

            connection.end();

            res.status(201).json({ message: 'Datos insertados correctamente' });
        } catch (error) {
            console.error('Error al insertar datos en la base de datos:', error);
            res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
};
