import { NextApiRequest, NextApiResponse } from 'next';
import { createConnection } from 'mysql2/promise';

// Función para conectar a la base de datos
async function connectToDatabase() {
  try {
    const connection = await createConnection({
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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { Idclient, Idemployee, statetask = 'ACEPTADO', state = 1, date = new Date().toISOString().split('T')[0], idEmpTask } = req.body;

    if (!Idclient || !Idemployee || !idEmpTask) {
      return res.status(400).json({ error: 'Los campos Idclient, Idemployee e idEmpTask son obligatorios.' });
    }

    let connection;
    try {
      connection = await connectToDatabase();

      // Verificar si idEmpTask existe en la tabla employeespertask
      const checkEmpTaskQuery = 'SELECT id FROM employeespertask WHERE id = ?';
      const [taskRows]: any = await connection.execute(checkEmpTaskQuery, [idEmpTask]);

      if (taskRows.length === 0) {
        return res.status(400).json({ error: 'idEmpTask no existe en la tabla employeespertask.' });
      }

      const addEmployeeQuery = `
        INSERT INTO customerperemployee (idClient, date, statusTask, status, idEmployee, idEmpTask)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      const [addResult]: any = await connection.execute(addEmployeeQuery, [Idclient, date, statetask, state, Idemployee, idEmpTask]);

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
      if (connection) {
        await connection.end();
      }
    }
  } else {
    res.status(405).json({ error: 'Método no permitido.' });
  }
};

export default handler;
