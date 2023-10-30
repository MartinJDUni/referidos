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
      // Realiza la consulta SQL deseada
      const [rows] = await connection.execute('SELECT * FROM task');
      connection.end();
      res.status(200).json({ data: rows });
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
  } else if (req.method === 'POST') {
    const { name, description } = req.body; // Asume que estás enviando datos de nombre y descripción en el cuerpo de la solicitud POST.

    if (!name || !description) {
      res.status(400).json({ error: 'Faltan datos obligatorios' });
      return;
    }

    const connection = await connectToDatabase();

    try {
      // Realiza la inserción de datos en la base de datos
      const [result] = await connection.execute(
        'INSERT INTO task (Name, Descrition,state) VALUES (?, ?, ?)',
        [name, description,1]
      );
      connection.end();
      res.status(201).json({ message: 'Datos insertados correctamente', insertedId: result.insertId });
    } catch (error) {
      console.error('Error al insertar datos en la base de datos:', error);
      res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
    }
  }
};
