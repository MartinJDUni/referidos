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
  if (req.method === 'POST') {
    const { Idclient, Idemployee, Idstatetask = 3, state = 1, date = new Date().toISOString() } = req.body;

    if (!Idclient || !Idemployee) {
      return res.status(400).json({ error: 'Los campos Idclient e Idemployee son obligatorios.' });
    }

    const connection = await connectToDatabase();

    try {
      // Realiza la consulta SQL para agregar un nuevo registro a la tabla customerperemployee
      const addEmployeeQuery = `
        INSERT INTO customerperemployee (Idclient, Idemployee, Idstatetask, state, date)
        VALUES (?, ?, ?, ?, ?);
      `;
      const [addResult] = await connection.execute(addEmployeeQuery, [Idclient, Idemployee, Idstatetask, state, date]);

      // Verifica si la inserción fue exitosa
      if (addResult.affectedRows > 0) {
        const clientId = addResult.insertId;
        console.log(`Registro agregado correctamente. ID del nuevo registro: ${clientId}`);
        res.status(200).json({ message: 'Registro agregado correctamente.', clientId });
      } else {
        console.error('Error al agregar el registro a la base de datos.');
        res.status(500).json({ error: 'Error al agregar el registro a la base de datos.' });
      }
    } catch (error) {
      console.error('Error al agregar el registro:', error);
      res.status(500).json({ error: 'Error al agregar el registro.' });
    } finally {
      connection.end();
    }
  } else {
    res.status(405).json({ error: 'Método no permitido.' });
  }
};
