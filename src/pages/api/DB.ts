import { createConnection } from 'mysql2/promise';

export default async (req, res) => {
  if (req.method === 'GET') {
    const connection = await connectToDatabase();

    try {
      const query = `
        SELECT cpe.Id, cl.Name AS ClientName, e.Name AS EmployeeName, st.State AS StateTaskName, cpe.state, cpe.date
        FROM customerperemployee cpe
        INNER JOIN client cl ON cpe.Idclient = cl.Id
        INNER JOIN employee e ON cpe.Idemployee = e.Id
        INNER JOIN statetask st ON cpe.Idstatetask = st.Id
        WHERE st.State = 'ACEPTADO';
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

