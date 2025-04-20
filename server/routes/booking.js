const express = require('express');
const router = express.Router();

// Function to get all bookings
const getAllBookings = async (pool) => {
  const query = `
    SELECT 
      b.booking_id,
      b.match_id,
      b.user_id,
      b.booking_time,
      b.status,
      m.match_date,
      ht.team_name AS home_team_name,
      at.team_name AS away_team_name
    FROM booking b
    JOIN match_table m ON b.match_id = m.match_id
    JOIN team ht ON m.home_team_id = ht.team_id
    JOIN team at ON m.away_team_id = at.team_id;
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }
};

// Function to get booking details for a specific match
const getBookingDetails = async (pool, matchId) => {
  const query = `
    SELECT 
      b.booking_id,
      b.match_id,
      b.user_id,
      b.booking_time,
      b.status
    FROM booking b
    WHERE b.match_id = $1;
  `;

  try {
    const result = await pool.query(query, [matchId]);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch booking details: ${error.message}`);
  }
};

/**
 * GET /api/booking/
 * Retrieves all bookings with match and team details.
 */
router.get('/', async (req, res, next) => {
  try {
    const pool = req.app.get('db');
    const bookings = await getAllBookings(pool);
    res.status(200).json(bookings);
  } catch (error) {
    next(error); // Pass to global error handler
  }
});

/**
 * GET /api/booking/:matchId
 * Retrieves booking details for a specific match.
 */
router.get('/:matchId', async (req, res, next) => {
  try {
    const pool = req.app.get('db');
    const matchId = req.params.matchId;
    const bookings = await getBookingDetails(pool, matchId);
    res.status(200).json(bookings);
  } catch (error) {
    next(error); // Pass to global error handler
  }
});

module.exports = router;