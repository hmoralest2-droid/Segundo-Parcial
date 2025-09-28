import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/clientes.js';
import taskRoutes from './routes/ordenes.js';

const app = express();

app.use(express.json());
app.use('/clientes', userRoutes);
app.use('/ordenes', taskRoutes);

// Configuración para servir frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// Para rutas SPA (cualquier otra ruta devuelve index.html)
app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
