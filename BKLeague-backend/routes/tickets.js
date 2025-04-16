const express = require('express');
const { authMiddleware } = require('./middleware');
const router = express.Router();

router.get('/', authMiddleware, async (req, res, next) => {
  const pool = req.app.get('db');
  try {
    const { rows } = await pool.query('SELECT * FROM tickets WHERE user_id IS NULL');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.post('/purchase', authMiddleware, async (req, res, next) => {
  const pool = req.app.get('db');
  const { ticketId, services } = req.body;
  if (!ticketId) return res.status(400).json({ success: false, error: 'Ticket ID required' });
  try {
    const { rowCount } = await pool.query(
      'UPDATE tickets SET user_id = $1, services = $2 WHERE id = $3 AND user_id IS NULL',
      [req.user.id, services || '', ticketId]
    );
    if (rowCount === 0) return res.status(404).json({ success: false, error: 'Ticket not available' });
    res.json({ success: true, data: { message: 'Ticket purchased' } });
  } catch (err) {
    next(err);
  }
});

router.get('/my-tickets', authMiddleware, async (req, res, next) => {
  const pool = req.app.get('db');
  try {
    const { rows } = await pool.query(
      'SELECT t.*, m.teams, m.date FROM tickets t JOIN matches m ON t.match_id = m.id WHERE t.user_id = $1',
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;