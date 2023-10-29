import { createConnection } from 'mysql2/promise';

export async function connectToDatabase() {
    const connection = await createConnection({
        host: 'localhost',
        user: 'root',
        password: '', // Cambia esto por la contraseña de tu base de datos
        database: 'referidos', // Cambia esto por el nombre de tu base de datos
    });
    return connection;
}

export default async (req, res) => {
    if (req.method === 'GET') {
        const connection = await connectToDatabase();

        try {
            const query = `
            SELECT e.Name AS EmployeeName, COUNT(*) AS CantidadTotalAceptados
            FROM employeespertask et
            JOIN customerperemployee ce ON et.Idemployee = ce.Idemployee
            JOIN employee e ON e.Id = et.Idemployee
            WHERE ce.Idstatetask = '1'
            AND ce.date BETWEEN et.Startdate AND et.Finaldate
            GROUP BY e.Name;
            `;
            const [rows] = await connection.execute(query);
            connection.end();
            res.status(200).json({ CantidadAceptados: rows[0].CantidadAceptados });
        } catch (error) {
            console.error('Error al consultar la base de datos:', error);
            res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
    }
};
