const express = require('express');
const { authMiddleware, roleMiddleware } = require('./middleware');
const router = express.Router();

router.get('/', authMiddleware, async (req, res, next) => {
  const pool = req.app.get('db');
  try {
    const { rows } = await pool.query('SELECT * FROM players');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res, next) => {
  const pool = req.app.get('db');
  const { name, team, performance_data } = req.body;
  if (!name) return res.status(400).json({ success: false, error: 'Name required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO players (name, team, performance_data) VALUES ($1, $2, $3) RETURNING *',
      [name, team, performance_data || {}]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res, next) => {
  const pool = req.app.get('db');
  const { id } = req.params;
  const { performance_data } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE players SET performance_data = $1 WHERE id = $2 RETURNING *',
      [performance_data || {}, id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Player not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;