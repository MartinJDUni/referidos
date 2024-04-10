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
