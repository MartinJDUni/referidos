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
    if (req.method === 'PUT') {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID no proporcionado' });
        }

        const connection = await connectToDatabase();

        try {
            // Actualiza el estado a 1 para reactivar en lugar de eliminar físicamente
            const updateQuery = `
          UPDATE employee
          SET state = 1
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
