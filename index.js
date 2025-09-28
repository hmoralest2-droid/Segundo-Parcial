import express from 'express';
import userRoutes from './clientes.js';
import taskRoutes from './ordenes.js';

const app = express();

app.use(express.json());
app.use('/clientes', userRoutes);
app.use('/ordenes', taskRoutes);




const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
