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
      const { id, newComment } = req.body;
  
      if (!id || !newComment) {
        return res.status(400).json({ error: 'Los campos id y newComment son obligatorios.' });
      }
  
      const connection = await connectToDatabase();
  
      try {
        // Realiza la consulta SQL para agregar un nuevo comentario a la tabla commentperemployee
        const addCommentQuery = `
          INSERT INTO commentperemployee (Idcustomerperemployee, comment, state)
          VALUES (?, ?, ?);
        `;
        const [addResult] = await connection.execute(addCommentQuery, [id, newComment, 1]);
  
        // Verifica si la inserción fue exitosa
        if (addResult.affectedRows > 0) {
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
        connection.end();
      }
    } else {
      res.status(405).json({ error: 'Método no permitido.' });
    }
  };