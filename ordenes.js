import express from 'express';
import pool from '../db/connection.js';

const router = express.Router();

// Crear tarea
router.post('/', async (req, res) => {
  const { cliente_id, platillo_nombre, notes } = req.body;

  if (!cliente_id || !platillo_nombre || !notes) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: cliente_id, notes o platillo_nombre' });
  }

  try {
    // Verificar que el usuario exista
    const userCheck = await pool.query('SELECT id FROM clientes WHERE id = $1', [cliente_id]);
    if (userCheck.rowCount === 0) {
      return res.status(400).json({ error: `El cliente con id ${cliente_id} no existe` });
    }

    // Insertar tarea
    const result = await pool.query(
      'INSERT INTO ordenes (cliente_id, platillo_nombre, notes) VALUES ($1, $2, $3) RETURNING *',
      [cliente_id, platillo_nombre, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Listar tareas por usuario
router.get('/:clienteId', async (req, res) => {
  const { clienteId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM ordenes WHERE cliente_id=$1 ORDER BY creado DESC',
      [clienteId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Cambiar estado de tarea
router.put('/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // pending, preparing, delivered
  const allowed = ['pending', 'preparing', 'delivered'];
  if (!allowed.includes(estado)) return res.status(400).json({ msg: 'Estado inválido' });

  try {
    const result = await pool.query(
      'UPDATE ordenes SET estado=$1 WHERE id=$2 RETURNING *',
      [estado, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ msg: 'Orden no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;
