import { createConnection, RowDataPacket } from 'mysql2/promise';

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
            json: (arg0: { statetask?: RowDataPacket[]; error?: string; message?: string }) => void;
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

            const statetaskQuery = `
                SELECT e.id AS id_empleado, s.subTask AS subtarea 
                FROM employeespertask e 
                JOIN subtask s ON e.idSubTask = s.id 
                JOIN employee se ON e.idEmployee = se.id 
                WHERE se.id = ?;
            `;
            const [statetaskRows] = await connection.execute<RowDataPacket[]>(statetaskQuery, [employeeId]);
            
            console.log(statetaskRows);
            res.status(200).json({
                statetask: statetaskRows,
            });
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
