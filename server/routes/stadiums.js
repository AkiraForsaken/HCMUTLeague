const express = require('express');
const router = express.Router();

// Get all stadiums
router.get('/', async (req, res) => {
  const pool = req.app.get('db');
  try {
    const { rows } = await pool.query(`
      SELECT 
        stadium_id, 
        stadium_name, 
        stadium_another_name, 
        stadium_address, 
        capacity, 
        stadium_photo_url,
        stadium_size,
        stadium_construction_date,
        stadium_construction_cost,
        stadium_owner_team,
        stadium_public_transit
      FROM stadium 
      ORDER BY stadium_name ASC
    `);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'No stadiums found' });
    }
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching stadiums:', err.message, err.stack);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get stadium by stadium_name
router.get('/:stadium_name', async (req, res) => {
  const pool = req.app.get('db');
  const { stadium_name } = req.params;
  try {
    const { rows } = await pool.query(`
      SELECT 
        stadium_id, 
        stadium_name, 
        stadium_another_name, 
        stadium_address, 
        capacity, 
        stadium_photo_url,
        stadium_size,
        stadium_construction_date,
        stadium_construction_cost,
        stadium_owner_team,
        stadium_public_transit
      FROM stadium 
      WHERE stadium_name = $1
    `, [stadium_name]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Stadium not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Error fetching stadium details:', err.message, err.stack);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;