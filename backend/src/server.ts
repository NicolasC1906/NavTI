import express, { Request, Response } from 'express';
import mysql, { Connection, MysqlError } from 'mysql';
import cors from 'cors';

const app = express();
const port = 3000;

// Configuración de la conexión a MySQL
const connectionConfig: mysql.ConnectionConfig = {
  host: 'srv628.hstgr.io',
  user: 'u179706313_gymone',
  password: 'Testgym2024',
  database: 'u179706313_gym',
};

// Crear la conexión a la base de datos
const connection: Connection = mysql.createConnection(connectionConfig);

// Conectar a la base de datos
connection.connect((error: MysqlError | null) => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw error;
  }
  console.log('Conexión a la base de datos establecida correctamente');
});

// Middleware CORS para todas las rutas
app.use(cors());
app.use(express.json());

// Obtener todos los usuarios
app.get('/usuarios', (req: Request, res: Response) => {
  const query = 'SELECT * FROM Usuarios';

  connection.query(query, (error: MysqlError | null, results: any[]) => {
    if (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error al obtener usuarios de la base de datos' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Crear un nuevo usuario
app.post('/usuarios', (req: Request, res: Response) => {
  const { nombre, apellido, correoElectronico, numeroTelefono, fechaNacimiento, genero, direccion } = req.body;

  const query = `INSERT INTO Usuarios (Nombre, Apellido, CorreoElectronico, NumeroTelefono, FechaNacimiento, Genero, Direccion)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [nombre, apellido, correoElectronico, numeroTelefono, fechaNacimiento, genero, direccion], (error: MysqlError | null, result: any) => {
    if (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ error: 'Error al crear usuario en la base de datos' });
    } else {
      res.status(201).json({ message: 'Usuario creado exitosamente', id: result.insertId });
    }
  });
});

// Obtener un usuario por ID
app.get('/usuarios/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM Usuarios WHERE ID_Usuario = ?';

  connection.query(query, [userId], (error: MysqlError | null, results: any[]) => {
    if (error) {
      console.error('Error al obtener usuario por ID:', error);
      res.status(500).json({ error: 'Error al obtener usuario de la base de datos' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.status(200).json(results[0]);
      }
    }
  });
});

// Actualizar un usuario por ID
app.put('/usuarios/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  const { nombre, apellido, correoElectronico, numeroTelefono, fechaNacimiento, genero, direccion } = req.body;

  const query = `UPDATE Usuarios
                 SET Nombre = ?, Apellido = ?, CorreoElectronico = ?, NumeroTelefono = ?, FechaNacimiento = ?, Genero = ?, Direccion = ?
                 WHERE ID_Usuario = ?`;

  connection.query(
    query,
    [nombre, apellido, correoElectronico, numeroTelefono, fechaNacimiento, genero, direccion, userId],
    (error: MysqlError | null) => {
      if (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario en la base de datos' });
      } else {
        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
      }
    }
  );
});

// Eliminar un usuario por ID
app.delete('/usuarios/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  const query = 'DELETE FROM Usuarios WHERE ID_Usuario = ?';

  connection.query(query, [userId], (error: MysqlError | null, result: any) => {
    if (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ error: 'Error al eliminar usuario de la base de datos' });
    } else {
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
      }
    }
  });
});

// Manejar rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).send('Ruta no encontrada');
});

// Manejar errores
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send('Error en el servidor');
});

// Escuchar en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
