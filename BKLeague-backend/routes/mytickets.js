const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('./middleware');

// GET /api/mytickets - Fetch all tickets for the authenticated user
router.get('/', authMiddleware, roleMiddleware(['Spectator']), async (req, res) => {
  const pool = req.app.get('db');
  const userId = req.user.userid; // From JWT token

  try {
    const query = `
      SELECT 
        vm.view_match_id,
        vm.match_id,
        vm.seat_level,
        vm.quantity,
        vm.total_price,
        m.match_time,
        m.match_date,
        m.is_finished,
        ht.team_name AS home_team_name,
        ht.team_logo_url AS home_team_logo,
        at.team_name AS away_team_name,
        at.team_logo_url AS away_team_logo,
        s.stadium_name,
        m.price_seat_level_a,
        m.price_seat_level_b,
        m.price_seat_level_c,
        m.price_seat_level_d
      FROM view_match vm
      JOIN match_table m ON vm.match_id = m.match_id
      JOIN team ht ON m.home_team_id = ht.team_id
      JOIN team at ON m.away_team_id = at.team_id
      JOIN stadium s ON m.stadium_id = s.stadium_id
      WHERE vm.spectator_id = $1
      ORDER BY m.match_date DESC, m.match_time DESC;
    `;
    const result = await pool.query(query, [userId]);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching tickets',
    });
  }
});

// GET /api/mytickets/:viewMatchId - Fetch a single ticket by ID
router.get('/:viewMatchId', authMiddleware, roleMiddleware(['Spectator']), async (req, res) => {
  const pool = req.app.get('db');
  const userId = req.user.userid;
  const viewMatchId = parseInt(req.params.viewMatchId);

  if (isNaN(viewMatchId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ticket ID',
    });
  }

  try {
    const query = `
      SELECT 
        vm.view_match_id,
        vm.match_id,
        vm.seat_level,
        vm.quantity,
        vm.total_price,
        m.match_time,
        m.match_date,
        m.is_finished,
        ht.team_name AS home_team_name,
        ht.team_logo_url AS home_team_logo,
        at.team_name AS away_team_name,
        at.team_logo_url AS away_team_logo,
        s.stadium_name,
        m.price_seat_level_a,
        m.price_seat_level_b,
        m.price_seat_level_c,
        m.price_seat_level_d
      FROM view_match vm
      JOIN match_table m ON vm.match_id = m.match_id
      JOIN team ht ON m.home_team_id = ht.team_id
      JOIN team at ON m.away_team_id = at.team_id
      JOIN stadium s ON m.stadium_id = s.stadium_id
      WHERE vm.view_match_id = $1 AND vm.spectator_id = $2;
    `;
    const result = await pool.query(query, [viewMatchId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found or not owned by user',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error fetching ticket:', err);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching ticket',
    });
  }
});

// DELETE /api/mytickets/:viewMatchId - Cancel a ticket
router.delete('/:viewMatchId', authMiddleware, roleMiddleware(['Spectator']), async (req, res) => {
  const pool = req.app.get('db');
  const userId = req.user.userid;
  const viewMatchId = parseInt(req.params.viewMatchId);

  if (isNaN(viewMatchId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ticket ID',
    });
  }

  try {
    const matchQuery = `
      SELECT m.is_finished
      FROM view_match vm
      JOIN match_table m ON vm.match_id = m.match_id
      WHERE vm.view_match_id = $1 AND vm.spectator_id = $2;
    `;
    const matchResult = await pool.query(matchQuery, [viewMatchId, userId]);

    if (matchResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found or not owned by user',
      });
    }

    if (matchResult.rows[0].is_finished) {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel tickets for finished matches',
      });
    }

    const deleteQuery = `
      DELETE FROM view_match
      WHERE view_match_id = $1 AND spectator_id = $2
      RETURNING view_match_id;
    `;
    const result = await pool.query(deleteQuery, [viewMatchId, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found or not owned by user',
      });
    }

    res.json({
      success: true,
      data: { view_match_id: result.rows[0].view_match_id },
    });
  } catch (err) {
    console.error('Error deleting ticket:', err);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting ticket',
    });
  }
});

module.exports = router;