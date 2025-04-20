const express = require('express');
const router = express.Router();

// Helper function to calculate form (last 5 matches)
const getTeamForm = (matches, teamId) => {
  const form = [];
  // Filter matches involving the team, finished, and sort by date descending
  const teamMatches = matches
    .filter(
      (m) =>
        (m.home_team_id === teamId || m.away_team_id === teamId) && m.is_finished
    )
    .sort((a, b) => new Date(b.match_date) - new Date(a.match_date))
    .slice(0, 5); // Last 5 matches

  for (const match of teamMatches) {
    const [homeGoals, awayGoals] = match.score.split('-').map(Number);
    if (match.home_team_id === teamId) {
      if (homeGoals > awayGoals) form.push('W');
      else if (homeGoals === awayGoals) form.push('D');
      else form.push('L');
    } else {
      if (awayGoals > homeGoals) form.push('W');
      else if (awayGoals === homeGoals) form.push('D');
      else form.push('L');
    }
  }
  // Pad with 'N/A' to ensure 5 elements
  while (form.length < 5) {
    form.push('N/A');
  }
  return form;
};

// Helper function to get next opponent
const getNextOpponent = (matches, teamId, teams) => {
  const nextMatch = matches
    .filter(
      (m) =>
        (m.home_team_id === teamId || m.away_team_id === teamId) &&
        !m.is_finished
    )
    .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))[0];

  if (!nextMatch) return null;
  const opponentId =
    nextMatch.home_team_id === teamId
      ? nextMatch.away_team_id
      : nextMatch.home_team_id;
  const opponent = teams.find((t) => t.team_id === opponentId);
  return {
    club: opponent.team_name,
    logo: opponent.team_logo_url,
  };
};

router.get('/', async (req, res) => {
  try {
    const pool = req.app.get('db'); // Get pool from app settings

    // Fetch all teams with logo and other relevant fields
    const teamsResult = await pool.query('SELECT team_id, team_name, team_logo_url FROM team');
    const teams = teamsResult.rows;

    // Fetch all matches
    const matchesResult = await pool.query('SELECT * FROM match_table');
    const matches = matchesResult.rows;

    // Compute league table
    const leagueTable = teams.map((team) => {
      const teamMatches = matches.filter(
        (m) =>
          (m.home_team_id === team.team_id || m.away_team_id === team.team_id) &&
          m.is_finished
      );

      let played = 0,
        won = 0,
        drawn = 0,
        lost = 0,
        gf = 0,
        ga = 0;

      for (const match of teamMatches) {
        played++;
        const [homeGoals, awayGoals] = match.score.split('-').map(Number);
        if (match.home_team_id === team.team_id) {
          gf += homeGoals;
          ga += awayGoals;
          if (homeGoals > awayGoals) won++;
          else if (homeGoals === awayGoals) drawn++;
          else lost++;
        } else {
          gf += awayGoals;
          ga += homeGoals;
          if (awayGoals > homeGoals) won++;
          else if (awayGoals === homeGoals) drawn++;
          else lost++;
        }
      }

      const points = won * 3 + drawn;
      const gd = gf - ga;

      return {
        team_id: team.team_id,
        club: team.team_name,
        logo: team.team_logo_url,
        played,
        won,
        drawn,
        lost,
        gf,
        ga,
        gd,
        points,
        form: getTeamForm(matches, team.team_id),
        next: getNextOpponent(matches, team.team_id, teams),
      };
    });

    // Sort by points (desc), then gd, then gf
    leagueTable.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });

    // Add position
    const tableWithPosition = leagueTable.map((team, index) => ({
      ...team,
      position: index + 1,
    }));

    res.json(tableWithPosition);
  } catch (err) {
    console.error('Error fetching league table:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;