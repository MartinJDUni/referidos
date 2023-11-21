// api/databaseEmployeeS.js
import { createConnection } from 'mysql2/promise';

export default async (req, res) => {
  if (req.method === 'GET') {
    const connection = await connectToDatabase();

    try {
      // Realiza la consulta SQL para obtener solo el ID del empleado
      const statetaskQuery = `
        SELECT Id, State
        FROM statetask;
      `;
      const [statetaskRows] = await connection.execute(statetaskQuery);
      console.log(statetaskRows);
      connection.end();
      res.status(200).json({
        statetask: statetaskRows,
      });
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
  }else if (req.method === 'PUT') {
    // Si la solicitud es de tipo PUT, intenta actualizar el estado de un empleado
    const { id, newState } = req.body;

    if (!id || !newState) {
      return res.status(400).json({ error: 'Se requiere el ID y el nuevo estado para actualizar.' });
    }

    const connection = await connectToDatabase();

    try {
      // Realiza la consulta SQL para actualizar el estado del empleado
      const updateEmployeeStateQuery = `
        UPDATE customerperemployee
        SET Idstatetask = ?
        WHERE Id = ?; 
      `;
      const [updateResult] = await connection.execute(updateEmployeeStateQuery, [newState, id]);

      // Verifica si la actualización fue exitosa
      if (updateResult.affectedRows > 0) {
        console.log(`Estado actualizado correctamente para el empleado con ID ${id}`);
        res.status(200).json({ message: 'Estado actualizado correctamente.' });
      } else {
        console.error(`No se encontró ningún empleado con ID ${id}`);
        res.status(404).json({ error: 'No se encontró ningún empleado con el ID proporcionado.' });
      }

    } catch (error) {
      console.error('Error al actualizar el estado del empleado:', error);
      res.status(500).json({ error: 'Error al actualizar el estado del empleado.' });
    } finally {
      connection.end();
    }
  }else if (req.method === 'POST') {
    // Si la solicitud es de tipo PUT, intenta agregar un cliente
    const { name, phone, idcard } = req.body;
  
    if (!name || !phone || !idcard) {
      return res.status(400).json({ error: 'Se requiere el nombre, correo electrónico y teléfono para agregar un cliente.' });
    }
  
    const connection = await connectToDatabase();
  
    try {
      // Realiza la consulta SQL para agregar un cliente
      const addClientQuery = `
        INSERT INTO client (Name, Phone, Idcard)
        VALUES (?, ?, ?);
      `;
      const [addResult] = await connection.execute(addClientQuery, [name, phone, idcard]);
  
      // Verifica si la adición fue exitosa
      if (addResult.affectedRows > 0) {
        const clientId = addResult.insertId;
        console.log(`Cliente ${name} (ID: ${clientId}) agregado correctamente.`);
        res.status(200).json({ message: 'Cliente agregado correctamente.', clientId });
      } else {
        console.error('Error al agregar el cliente a la base de datos.');
        res.status(500).json({ error: 'Error al agregar el cliente a la base de datos.' });
      }
  
    } catch (error) {
      console.error('Error al agregar el cliente:', error);
      res.status(500).json({ error: 'Error al agregar el cliente.' });
    } finally {
      connection.end();
    }
  } 
};

export async function connectToDatabase() {
  const connection = await createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Cambia esto por la contraseña de tu base de datos
    database: 'referidos', // Cambia esto por el nombre de tu base de datos
  });
  return connection;
}
