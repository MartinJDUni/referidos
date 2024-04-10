import { createConnection } from 'mysql2/promise';

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
