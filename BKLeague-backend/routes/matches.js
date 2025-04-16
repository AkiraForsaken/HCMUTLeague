const express = require('express');
const { authMiddleware, roleMiddleware } = require('./middleware');
const router = express.Router();

router.get('/', authMiddleware, async (req, res, next) => {
  const pool = req.app.get('db');
  const { date } = req.query;
  try {
    const query = date ? 'SELECT * FROM matches WHERE date::date = $1' : 'SELECT * FROM matches';
    const { rows } = await pool.query(query, date ? [date] : []);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res, next) => {
  const pool = req.app.get('db');
  const { teams, stats, date, location } = req.body;
  if (!teams || !date) return res.status(400).json({ success: false, error: 'Teams and date required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO matches (teams, stats, date, location) VALUES ($1, $2, $3, $4) RETURNING *',
      [teams, stats || {}, date, location]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;