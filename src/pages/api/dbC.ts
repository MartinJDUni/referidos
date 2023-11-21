import { createConnection } from 'mysql2/promise';

export default async (req, res) => {
    if (req.method === 'GET') {
        const connection = await connectToDatabase();

        try {
            const query = `
          SELECT
            e.Id AS EmployeeId,
            e.Name AS EmployeeName,
            COUNT(DISTINCT cpe.Id) AS TaskCount,
            GROUP_CONCAT(DISTINCT cpe.Id) AS TaskIds
          FROM customerperemployee cpe
          INNER JOIN employee e ON cpe.Idemployee = e.Id
          INNER JOIN statetask st ON cpe.Idstatetask = st.Id
          WHERE st.State = 'ACEPTADO'
          GROUP BY e.Id;
        `;
            const [rows] = await connection.execute(query);
            connection.end();
            res.status(200).json({ data: rows });
        } catch (error) {
            console.error('Error al consultar la base de datos:', error);
            res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
    }
};

async function connectToDatabase() {
    const connection = await createConnection({
        host: 'localhost',
        user: 'root',
        password: '', // Cambia esto por la contraseña de tu base de datos
        database: 'referidos', // Cambia esto por el nombre de tu base de datos
    });
    return connection;
}
