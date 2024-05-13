import { createConnection } from 'mysql2/promise';

export async function connectToDatabase() {
  let connection = null;

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

export default async (req: { method: string; body: { id: any; newComment: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; message?: string; commentId?: any; }): void; new(): any; }; }; }) => {
    if (req.method === 'POST') {
      const { id, newComment } = req.body;
  
      if (!id || !newComment) {
        return res.status(400).json({ error: 'Los campos id y newComment son obligatorios.' });
      }
  
      const connection = await connectToDatabase();
  
      try {
        const addCommentQuery = `
          INSERT INTO commentperemployee (Idcustomerperemployee, comment, state)
          VALUES (?, ?, ?);
        `;
        const [addResult] = await connection.execute(addCommentQuery, [id, newComment, 1]);
  
        if ('affectedRows' in addResult && addResult.affectedRows > 0) {
          const commentId = addResult.insertId;
          console.log(`Comentario agregado correctamente. ID del nuevo comentario: ${commentId}`);
          res.status(200).json({ message: 'Comentario agregado correctamente.', commentId });
        } else {
          console.error('Error al agregar el comentario a la base de datos.');
          res.status(500).json({ error: 'Error al agregar el comentario a la base de datos.' });
        }
      } catch (error) {
        console.error('Error al agregar el comentario:', error);
        res.status(500).json({ error: 'Error al agregar el comentario.' });
      } finally {
        if (connection) {
          connection.end();
        }
      }
    } else {
      res.status(405).json({ error: 'Método no permitido.' });
    }
};
