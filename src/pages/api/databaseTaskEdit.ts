import { createConnection } from 'mysql2/promise';

export async function connectToDatabase() {
  const connection = await createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Change this to your database password
    database: 'referidos', // Change this to your database name
  });
  return connection;
}

export default async (req, res) => {
  if (req.method === 'PUT') {
    const { id, name, description } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID not provided' });
    }

    let connection;

    try {
      console.log('Initializing database connection...');
      connection = await connectToDatabase();

      // Update name, description, and state (assuming state is an INT column)
      const updateQuery = 'UPDATE task SET name = ?, Descrition = ?, state = ? WHERE id = ?;';
      await connection.execute(updateQuery, [name, description, 1, id]);
      res.status(200).json({ message: 'Data updated successfully' });

      console.log('Operation successful.');
    } catch (error) {
        console.error('Error updating in the database:', error);
        res.status(500).json({
          error: 'Error updating in the database',
          message: error.message,
          stack: error.stack,
        });
      }
  }
};
