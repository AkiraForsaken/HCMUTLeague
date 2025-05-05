const express = require('express');
const router = express.Router();

// Get all teams
router.get('/', async (req, res) => {
  const pool = req.app.get('db');
  try {
    const { rows } = await pool.query(
      'SELECT team_id, team_another_name, team_name, team_city, team_country, team_created_at, team_trophies, team_owner, group_id, team_logo_url FROM team ORDER BY team_name ASC'
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'No teams found' });
    }
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching all teams:', err.message, err.stack);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get team by team_name
router.get('/:team_name', async (req, res) => {
  const pool = req.app.get('db');
  const { team_name } = req.params;
  console.log('Fetching team details for:', team_name);
  try {
    // Validate team_name
    if (!team_name || typeof team_name !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid team name' });
    }
    const { rows } = await pool.query(
      'SELECT team_id, team_another_name, team_name, team_city, team_country, team_created_at, team_trophies, team_owner, group_id, team_logo_url FROM team WHERE team_name = $1',
      [team_name]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(`Error fetching team ${team_name}:`, err.message, err.stack);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get team members (players, coaches, club doctors)
router.get('/:team_name/members', async (req, res) => {
  const pool = req.app.get('db');
  const { team_name } = req.params;
  console.log('Fetching members for team:', team_name);
  try {
    // Validate team_name
    if (!team_name || typeof team_name !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid team name' });
    }
    // Get team_id
    const teamResult = await pool.query('SELECT team_id FROM team WHERE team_name = $1', [team_name]);
    if (teamResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }
    const team_id = teamResult.rows[0].team_id;

    // Get players
    const playersResult = await pool.query(
      `SELECT com_id, com_first_name, com_last_name, squad_number, position_player
       FROM player
       WHERE team_id = $1
       ORDER BY CASE position_player
         WHEN 'Goalkeeper' THEN 1
         WHEN 'Defender' THEN 2
         WHEN 'Midfielder' THEN 3
         WHEN 'Forward' THEN 4
         ELSE 5
       END ASC, com_last_name ASC`,
      [team_id]
    );

    // Get coaches
    const coachesResult = await pool.query(
      'SELECT com_id, com_first_name, com_last_name FROM coach WHERE team_id = $1',
      [team_id]
    );

    // Get club doctors
    const doctorsResult = await pool.query(
      'SELECT com_id, com_first_name, com_last_name FROM club_doctor WHERE team_id = $1',
      [team_id]
    );

    res.json({
      success: true,
      data: {
        players: playersResult.rows.map(player => ({
          com_id: player.com_id,
          full_name: `${player.com_first_name} ${player.com_last_name}`,
          squad_number: player.squad_number,
          position: player.position_player
        })),
        coaches: coachesResult.rows.map(coach => ({
          com_id: coach.com_id,
          full_name: `${coach.com_first_name} ${coach.com_last_name}`,
          role: 'Coach'
        })),
        doctors: doctorsResult.rows.map(doctor => ({
          com_id: doctor.com_id,
          full_name: `${doctor.com_first_name} ${doctor.com_last_name}`,
          role: 'Club Doctor'
        }))
      }
    });
  } catch (err) {
    console.error(`Error fetching members for team ${team_name}:`, err.message, err.stack);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get member by com_id (player, coach, or club doctor)
router.get('/:team_name/members/:com_id', async (req, res) => {
  const pool = req.app.get('db');
  const { team_name, com_id } = req.params;
  console.log(`Fetching member ${com_id} for team ${team_name}`);
  try {
    // Validate inputs
    if (!team_name || !com_id || typeof team_name !== 'string' || typeof com_id !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid team name or member ID' });
    }
    // Get team_id
    const teamResult = await pool.query('SELECT team_id FROM team WHERE team_name = $1', [team_name]);
    if (teamResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }
    const team_id = teamResult.rows[0].team_id;

    // Check player table
    const playerResult = await pool.query(
      `SELECT com_id, com_first_name, com_last_name, squad_number, position_player, team_id,
              league_id, age, weight, height, total_min_play, total_goal, total_assist
       FROM player WHERE com_id = $1 AND team_id = $2`,
      [com_id, team_id]
    );
    if (playerResult.rows.length > 0) {
      const player = playerResult.rows[0];
      return res.json({
        success: true,
        data: {
          role: 'Player',
          full_name: `${player.com_first_name} ${player.com_last_name}`,
          squad_number: player.squad_number,
          position: player.position_player,
          com_id: player.com_id,
          team_id: player.team_id,
          league_id: player.league_id,
          age: player.age,
          weight: player.weight,
          height: player.height,
          total_min_play: player.total_min_play,
          total_goal: player.total_goal,
          total_assist: player.total_assist
        }
      });
    }

    // Check coach table
    const coachResult = await pool.query(
      'SELECT com_id, com_first_name, com_last_name, team_id, coach_title FROM coach WHERE com_id = $1 AND team_id = $2',
      [com_id, team_id]
    );
    if (coachResult.rows.length > 0) {
      const coach = coachResult.rows[0];
      return res.json({
        success: true,
        data: {
          role: 'Coach',
          full_name: `${coach.com_first_name} ${coach.com_last_name}`,
          com_id: coach.com_id,
          team_id: coach.team_id,
          coach_title: coach.coach_title
        }
      });
    }

    // Check club_doctor table
    const doctorResult = await pool.query(
      'SELECT com_id, com_first_name, com_last_name, team_id FROM club_doctor WHERE com_id = $1 AND team_id = $2',
      [com_id, team_id]
    );
    if (doctorResult.rows.length > 0) {
      const doctor = doctorResult.rows[0];
      return res.json({
        success: true,
        data: {
          role: 'Club Doctor',
          full_name: `${doctor.com_first_name} ${doctor.com_last_name}`,
          com_id: doctor.com_id,
          team_id: doctor.team_id
        }
      });
    }

    return res.status(404).json({ success: false, error: 'Member not found' });
  } catch (err) {
    console.error(`Error fetching member ${com_id} for team ${team_name}:`, err.message, err.stack);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;