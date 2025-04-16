const express = require('express');
const { authMiddleware, roleMiddleware } = require('./middleware');
const router = express.Router();

router.post('/posts', authMiddleware, roleMiddleware(['admin']), async (req, res, next) => {
  const pool = req.app.get('db');
  const { title, body_content } = req.body;
  if (!title || !body_content) return res.status(400).json({ success: false, error: 'Title and content required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO posts (title, body_content, author_id) VALUES ($1, $2, $3) RETURNING *',
      [title, body_content, req.user.id]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

router.get('/posts', authMiddleware, async (req, res, next) => {
  const pool = req.app.get('db');
  try {
    const { rows } = await pool.query('SELECT p.*, u.username FROM posts p JOIN users u ON p.author_id = u.id');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;