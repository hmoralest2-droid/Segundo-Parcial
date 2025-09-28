import express from 'express';
import pool from '../db/connection.js';

const router = express.Router();

// Registrar usuario
router.post('/registrar', async (req, res) => {
  const { nombre, email, telefono } = req.body;
  try {
    const existing = await pool.query('SELECT * FROM clientes WHERE email=$1', [email]);
    if (existing.rows.length > 0) return res.status(400).json({ msg: 'Email ya registrado' });

    const result = await pool.query(
      'INSERT INTO clientes (nombre, email, telefono) VALUES ($1,$2,$3) RETURNING *',
      [nombre, email, telefono]
    );

    res.json({ cliente: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, telefono } = req.body;
  try {
    const cliente = await pool.query('SELECT * FROM clientes WHERE email=$1', [email]);
    if (cliente.rows.length === 0) return res.status(400).json({ msg: 'Usuario no encontrado' });

    const isMatch = (telefono == cliente.rows[0].telefono);
    if (!isMatch) return res.status(400).json({ msg: 'Telefono incorrecto' });

    res.status(200).json({ msg: 'Ha ingresado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;
