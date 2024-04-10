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
      // Realiza la consulta SQL para obtener datos de empleado y nombre del rol
      const query = `
          SELECT e.Id, e.Name, e.Password, e.Email, e.state, r.Name AS RoleName
          FROM employee e
          INNER JOIN role r ON e.Idrole = r.Id;
      `;
      const [rows] = await connection.execute(query);
      connection.end();
      res.status(200).json({ data: rows });
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
  } else if (req.method === 'POST') {
    const { name, password, email, state, roleId } = req.body; // Asume que estás enviando datos en el cuerpo de la solicitud POST.

    if (!name || !password || !email) {
      res.status(400).json({ error: 'Faltan datos obligatorios' });
      return;
    }

    const connection = await connectToDatabase();

    try {
      // Realiza la inserción de datos en la base de datos
      const query = 'INSERT INTO employee (Name, Password, Email, state, Idrole) VALUES (?, ?, ?, ?, ?)';
      const [result] = await connection.execute(query, [name, password, email, 1, 2]);
      connection.end();
      res.status(201).json({ message: 'Datos insertados correctamente', insertedId: result.insertId });
    } catch (error) {
      console.error('Error al insertar datos en la base de datos:', error);
      res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
    }
  }else if (req.method === 'PUT') {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID no proporcionado' });
    }

    const connection = await connectToDatabase();

    try {
      // Actualiza el estado a 1 para reactivar en lugar de eliminar físicamente
      const updateQuery = `
        UPDATE employee
        SET state = 0
        WHERE Id = ?;
      `;
      await connection.execute(updateQuery, [id]);

      connection.end();
      res.status(200).json({ message: 'Reactivado con éxito' });
    } catch (error) {
      console.error('Error al reactivar en la base de datos:', error);
      res.status(500).json({ error: 'Error al reactivar en la base de datos' });
    }
  }
};
