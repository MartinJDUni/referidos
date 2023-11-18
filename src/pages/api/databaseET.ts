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
            // Realiza la consulta SQL para obtener datos de empleado y nombre del rol
            const query = `
                    SELECT et.Id, e.Name AS EmployeeName, t.Name AS TaskName, et.Goal, et.Startdate, et.Finaldate, et.state
                    FROM employeespertask et
                    JOIN employee e ON et.Idemployee = e.Id
                    JOIN task t ON et.Idtask = t.Id;            
          `;
            const [rows] = await connection.execute(query);
            connection.end();
            res.status(200).json({ data: rows });
        } catch (error) {
            console.error('Error al consultar la base de datos:', error);
            res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
    }else if (req.method === 'PUT') {
        const { id } = req.body;
    
        if (!id) {
          return res.status(400).json({ error: 'ID no proporcionado' });
        }
    
        const connection = await connectToDatabase();
    
        try {
          // Actualiza el estado a 0 en lugar de eliminar físicamente
          const updateQuery = `
            UPDATE employeespertask
            SET state = 0
            WHERE Id = ?;
          `;
          await connection.execute(updateQuery, [id]);
    
          connection.end();
          res.status(200).json({ message: 'Estado actualizado con éxito' });
        } catch (error) {
          console.error('Error al actualizar el estado en la base de datos:', error);
          res.status(500).json({ error: 'Error al actualizar el estado en la base de datos' });
        }
      }
};
