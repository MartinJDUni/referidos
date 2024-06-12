import { OkPacket, ProcedureCallPacket, ResultSetHeader, RowDataPacket, createConnection } from 'mysql2/promise';

export async function connectToDatabase() {
  let connection = null; // Variable definida fuera del bloque try

  try {
    connection = await createConnection({
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


export default async (req: { method: string; query: { id: any; }; body: { commentId: any; newState: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; data?: OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket; success?: boolean; }): void; new(): any; }; }; }) => {
  if (req.method === 'GET') {
    const { id } = req.query; // Obtiene el ID de la solicitud GET

    if (!id) {
      return res.status(400).json({ error: 'Debes proporcionar un ID' });
    }

    const connection = await connectToDatabase();

    try {
      // Realiza la consulta SQL para obtener los comentarios relacionados con el ID proporcionado
      const query = `
        SELECT c.Id, c.comment, c.stateView
        FROM commentperemployee c
        WHERE c.idEmpClie = ?;
      `;
      const [rows] = await connection.execute(query, [id]);
      connection.end();
      res.status(200).json({ data: rows });
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
  } else if (req.method === 'PUT') {
    const { commentId, newState } = req.body;

    if (!commentId || newState === undefined) {
      return res.status(400).json({ error: 'Se requieren commentId y newState' });
    }

    const connection = await connectToDatabase();

    try {
      // Realiza la consulta SQL para actualizar el estado del comentario
      const updateQuery = `
        UPDATE commentperemployee
        SET stateView = ?
        WHERE Id = ?;
      `;

      await connection.execute(updateQuery, [newState, commentId]);
      connection.end();

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error al actualizar el estado en la base de datos:', error);
      res.status(500).json({ error: 'Error al actualizar el estado en la base de datos' });
    }
  }
};
