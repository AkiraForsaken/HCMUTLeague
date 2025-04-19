const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('./middleware');

const getAllMatches = async (pool) => {
  const query = `
    SELECT 
      m.match_id,
      m.match_time,
      m.match_date,
      m.score,
      m.match_round,
      m.is_finished,
      m.home_team_id,
      ht.team_name AS home_team_name,
      ht.team_logo_url AS home_team_logo,
      m.away_team_id,
      at.team_name AS away_team_name,
      at.team_logo_url AS away_team_logo,
      m.stadium_id,
      s.stadium_name
    FROM match_table m
    JOIN team ht ON m.home_team_id = ht.team_id
    JOIN team at ON m.away_team_id = at.team_id
    JOIN stadium s ON m.stadium_id = s.stadium_id
    ORDER BY m.match_date, m.match_time;
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch matches: ${error.message}`);
  }
};


/**
 * GET /api/matches
 * Retrieves all matches with team and stadium details.
 */
router.get('/', async (req, res, next) => {
  try {
    const pool = req.app.get('db');
    const matches = await getAllMatches(pool);
    res.status(200).json(matches);
  } catch (error) {
    next(error);
  }
});

const getMatchById = async (pool, matchId) => {
  const query = `
    SELECT 
      m.match_id,
      m.match_time,
      m.match_date,
      m.score,
      m.match_round,
      m.is_finished,
      m.home_team_id,
      ht.team_name AS home_team_name,
      ht.team_logo_url AS home_team_logo,
      m.away_team_id,
      at.team_name AS away_team_name,
      at.team_logo_url AS away_team_logo,
      m.stadium_id,
      s.stadium_name,
      m.price_seat_level_a,
      m.price_seat_level_b,
      m.price_seat_level_c,
      m.price_seat_level_d
    FROM match_table m
    JOIN team ht ON m.home_team_id = ht.team_id
    JOIN team at ON m.away_team_id = at.team_id
    JOIN stadium s ON m.stadium_id = s.stadium_id
    WHERE m.match_id = $1;
  `;
  try {
    const result = await pool.query(query, [matchId]);

    if (result.rows.length === 0) {
      const error = new Error('Match not found');
      error.status = 404;
      throw error;
    }
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

router.get('/:matchId', async (req, res, next) => {
  try {
    const matchId = req.params.matchId;
    if (!matchId || matchId === 'undefined') {
      return res.status(400).json({ success: false, error: 'Invalid matchId' });
    }
    const pool = req.app.get('db');
    const match = await getMatchById(pool, matchId);
    res.status(200).json(match);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/matches/:matchId/booking
 * Books tickets for a match, restricted to Spectators.
 */
router.post('/:matchId/booking', authMiddleware, roleMiddleware(['Spectator']), async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const { seat_level, quantity } = req.body;
    const userId = req.user.userid;

    if (!['a', 'b', 'c', 'd'].includes(seat_level)) {
      return res.status(400).json({ error: 'Invalid seat level' });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const pool = req.app.get('db');
    const match = await getMatchById(pool, matchId);

    if (match.is_finished) {
      return res.status(400).json({ error: 'Cannot book tickets for finished matches' });
    }

    const priceField = `price_seat_level_${seat_level}`;
    const price = parseFloat(match[priceField]);
    if (isNaN(price)) {
      return res.status(500).json({ error: 'Invalid price configuration' });
    }

    const total_price = price * quantity;

    const viewMatchResult = await pool.query(
      `INSERT INTO view_match (match_id, user_id, seat, seat_level, quantity, total_price, spectator_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING view_match_id`,
      [matchId, userId, null, seat_level, quantity, total_price, userId]
    );

    res.status(200).json({ success: true, view_match_id: viewMatchResult.rows[0].view_match_id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;