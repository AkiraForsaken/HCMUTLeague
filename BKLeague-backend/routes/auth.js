const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('./middleware');
const router = express.Router();

router.post('/login', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, error: 'Username and password required' });
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (rows.length === 0) return res.status(401).json({ success: false, error: 'User not found' });
    const user = rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ 
        userid: user.id, 
        role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1day' });
      res.json({ success: true, data: { token, role: user.role } });
    } else {
      res.status(401).json({ success: false, error: 'Incorrect username or password' });
    }
  } catch (err) {
    next(err);
  }
});

router.post('/register/admin', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password, email, key } = req.body;
  if (key !== process.env.ADMIN_KEY) return res.status(403).json({ success: false, error: 'Invalid key, access denied. You must be an admin to register new admins.' });
  if (!username || !password || !email) return res.status(400).json({ success: false, error: 'Username, password, and email required' });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4)',
      [username, hashedPassword, email, 'admin']
    );
    res.status(201).json({ success: true, data: { message: 'Admin registered' } });
  } catch (err) {
    if (err.code === '23505') res.status(409).json({ success: false, error: 'Username or email already taken' });
    else {
      console.log(err);
      console.log(err.message);
      console.log(err.code);
      next(err);}
  }
});


router.post('/register/team', async (req, res, next) => {
  const pool = req.app.get('db');
  const { name, another_name, city, country, created_at, trophies, owner, group_id, team_logo_url, key } = req.body;
  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ success: false, error: 'Invalid key, access denied. You must be an admin to register new teams.' });
  }
  if (!name || !city || !country) {
    return res.status(400).json({ success: false, error: 'Name, city, and country required' });
  }

  // Normalize team name for duplicate check: trim, collapse spaces, lowercase
  const normalizedName = name.trim().replace(/\s+/g, ' ').toLowerCase();

  try {
    // Check for existing team with same normalized name
    const existingTeam = await pool.query(
      'SELECT 1 FROM team WHERE LOWER(team_name) = $1 OR (team_another_name IS NOT NULL AND LOWER(team_another_name) = $1)',
      [normalizedName]
    );
    if (existingTeam.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Team name or alternative name already taken' });
    }

    await pool.query(
      'INSERT INTO team (team_another_name, team_name, team_city, team_country, team_created_at, team_trophies, team_owner, group_id, team_logo_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [
        another_name || null,
        name, // Store original name
        city,
        country,
        created_at || null,
        trophies || 0,
        owner || null,
        group_id || null,
        team_logo_url || ''
      ]
    );
    res.status(201).json({ success: true, data: { message: 'Team registered' } });
  } catch (err) {
    console.error('Error registering team:', err);
    if (err.code === '23505') {
      res.status(409).json({ success: false, error: 'Team name or alternative name already taken' });
    } else {
      next(err);
    }
  }
});

router.post('/register/team_member/player', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password, email, first_name, last_name, age, com_street, postal_code, 
  squad_number, position_player, weight, height, team_name } = req.body;
  if (!username || !password || !email || !first_name || !last_name || !position_player || !weight || !height || !team_name) {
    return res.status(400).json({ success: false, error: 'All required fields must be provided' });
  }
  try {
    const { rows: teamRows } = await pool.query('SELECT * FROM team WHERE team_name = $1', [team_name]);
    const team = teamRows[0];
    if (!team) return res.status(400).json({ success: false, error: 'Team not found' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const {rows: userRows} = await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING league_id',
      [username, hashedPassword, email, 'Player']
    );

    await pool.query(
      `INSERT INTO player (com_first_name, com_last_name, age, com_street, 
      postal_code, squad_number, position_player, weight, height, team_id, league_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [first_name, last_name, age, com_street, postal_code, 
      squad_number, position_player, weight, height, team.team_id, userRows[0].league_id]
    );
    const {rows: userIdRows} = await pool.query(
      'SELECT * FROM player WHERE league_id = $1', [userRows[0].league_id]
    );
    const user_id = userIdRows[0].com_id;
    await pool.query(
      'UPDATE users SET id = $1 WHERE username = $2',
      [user_id, username]
    );
    res.status(201).json({ success: true, data: { message: 'Team member registered' } });
  } catch (err) {
    if (err.code === '23505') res.status(409).json({ success: false, error: 'Username or email already taken' });
    else {
      console.log(err);
      console.log(err.message);
      console.log(err.code);
      next(err);}
  }
});

router.post('/register/team_member/coach', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password, email, first_name, last_name, age, com_street, postal_code, team_name, coach_title } = req.body;
  if (!username || !password || !email || !first_name || !last_name || !team_name || !coach_title) {
    return res.status(400).json({ success: false, error: 'All required fields must be provided' });
  }
  try {
    const { rows: teamRows } = await pool.query('SELECT team_id FROM team WHERE team_name = $1', [team_name]);
    const team = teamRows[0];
    if (!team) return res.status(400).json({ success: false, error: 'Team not found' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const {rows: userRows} = await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING league_id',
      [username, hashedPassword, email, 'Coach']
    );
    await pool.query(
      `INSERT INTO coach (com_first_name, com_last_name, age, com_street, postal_code, coach_title, team_id, league_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [first_name, last_name, age, com_street, postal_code, coach_title, team.team_id, userRows[0].league_id]
    );
    const {rows: userIdRows} = await pool.query(
      'SELECT * FROM coach WHERE league_id = $1', [userRows[0].league_id]
    );
    const user_id = userIdRows[0].com_id;
    await pool.query(
      'UPDATE users SET id = $1 WHERE username = $2',
      [user_id, username]
    );
    res.status(201).json({ success: true, data: { message: 'Team member registered' } });
  } catch (err) {
    if (err.code === '23505') res.status(409).json({ success: false, error: 'Username or email already taken' });
    else {
      console.log(err);
      console.log(err.message);
      console.log(err.code);
      next(err);}
  }
});

router.post('/register/team_member/personal_doctor', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password, email, first_name, last_name, age, com_street, 
    postal_code, team_name, doctor_title, supported_player_id } = req.body;
  if (!username || !password || !email || !first_name || !last_name || !team_name || !doctor_title) {
    return res.status(400).json({ success: false, error: 'All required fields must be provided' });
  }
  try {
    const { rows: teamRows } = await pool.query('SELECT team_id FROM team WHERE team_name = $1', [team_name]);
    const team = teamRows[0];
    if (!team) return res.status(400).json({ success: false, error: 'Team not found' });

    const { rows: playerRows } = await pool.query('SELECT player_id FROM player WHERE player_id = $1', [supported_player_id]);
    const player = playerRows[0];
    if (!player) return res.status(400).json({ success: false, error: 'Player you are supporting not found' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const {rows: userRows} = await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING league_id',
      [username, hashedPassword, email, 'Personal Doctor']
    );
    await pool.query(
      `INSERT INTO personal_doctor (com_first_name, com_last_name, age, com_street, postal_code, doctor_title, team_id, supported_player_id, league_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [first_name, last_name, age, com_street, postal_code, doctor_title, team.team_id, supported_player_id, userRows[0].league_id]
    );
    const {rows: userIdRows} = await pool.query(
      'SELECT * FROM personal_doctor WHERE league_id = $1', [userRows[0].league_id]
    );
    const user_id = userIdRows[0].com_id;
    await pool.query(
      'UPDATE users SET id = $1 WHERE username = $2',
      [user_id, username]
    );
    res.status(201).json({ success: true, data: { message: 'Team member registered' } });
  } catch (err) {
    if (err.code === '23505') res.status(409).json({ success: false, error: 'Username or email already taken' });
    else {
      console.log(err);
      console.log(err.message);
      console.log(err.code);
      next(err);}
  }
});

router.post('/register/team_member/club_doctor', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password, email, first_name, last_name, age, com_street, postal_code, team_name, doctor_title } = req.body;
  if (!username || !password || !email || !first_name || !last_name || !team_name || !doctor_title) {
    return res.status(400).json({ success: false, error: 'All required fields must be provided' });
  }
  try {
    const { rows: teamRows } = await pool.query('SELECT team_id FROM team WHERE team_name = $1', [team_name]);
    const team = teamRows[0];
    if (!team) return res.status(400).json({ success: false, error: 'Team not found' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const {rows: userRows} = await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING league_id',
      [username, hashedPassword, email, 'Club Doctor']
    );
    await pool.query(
      `INSERT INTO club_doctor (com_first_name, com_last_name, age, com_street, postal_code, doctor_title, team_id, league_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [first_name, last_name, age, com_street, postal_code, doctor_title, team.team_id, userRows[0].league_id]
    );
    const {rows: userIdRows} = await pool.query(
      'SELECT * FROM club_doctor WHERE league_id = $1', [userRows[0].league_id]
    );
    const user_id = userIdRows[0].com_id;
    await pool.query(
      'UPDATE users SET id = $1 WHERE username = $2',
      [user_id, username]
    );
    res.status(201).json({ success: true, data: { message: 'Team member registered' } });
  } catch (err) {
    if (err.code === '23505') res.status(409).json({ success: false, error: 'Username or email already taken' });
    else {
      console.log(err);
      console.log(err.message);
      console.log(err.code);
      next(err);}
  }
});

router.post('/register/committee_member/main_referee', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password, email, first_name, last_name, nationality } = req.body;
  if (!username || !password || !email || !first_name || !last_name || !nationality) {
    return res.status(400).json({ success: false, error: 'All required fields must be provided' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const {rows: userRows} = await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING league_id',
      [username, hashedPassword, email, 'Main Referee']
    );
    await pool.query(
      'INSERT INTO main_referee (com_mem_first_name, com_mem_last_name, nationality, league_id) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, nationality, userRows[0].league_id]
    );
    const {rows: userIdRows} = await pool.query(
      'SELECT * FROM main_referee WHERE league_id = $1', [userRows[0].league_id]
    );
    const user_id = userIdRows[0].com_mem_id;
    await pool.query(
      'UPDATE users SET id = $1 WHERE username = $2',
      [user_id, username]
    );
    res.status(201).json({ success: true, data: { message: 'Committee member registered' } });
  } catch (err) {
    if (err.code === '23505') res.status(409).json({ success: false, error: 'Username or email already taken' });
    else {
      console.log(err);
      console.log(err.message);
      console.log(err.code);
      next(err);}
  }
});

router.post('/register/committee_member/match_manager', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password, email, first_name, last_name, nationality } = req.body;
  if (!username || !password || !email || !first_name || !last_name || !nationality) {
    return res.status(400).json({ success: false, error: 'All required fields must be provided' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const {rows: userRows} = await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING league_id',
      [username, hashedPassword, email, 'Match Manager']
    );
    await pool.query(
      'INSERT INTO match_manager (com_mem_first_name, com_mem_last_name, nationality, league_id) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, nationality, userRows[0].league_id]
    );
    const {rows: userIdRows} = await pool.query(
      'SELECT * FROM match_manager WHERE league_id = $1', [userRows[0].league_id]
    );
    const user_id = userIdRows[0].com_mem_id;
    await pool.query(
      'UPDATE users SET id = $1 WHERE username = $2',
      [user_id, username]
    );
    res.status(201).json({ success: true, data: { message: 'Committee member registered' } });
  } catch (err) {
    if (err.code === '23505') res.status(409).json({ success: false, error: 'Username or email already taken' });
    else {
      console.log(err);
      console.log(err.message);
      console.log(err.code);
      next(err);}
  }
});

router.post('/register/committee_member/video_assistant_referee', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password, email, first_name, last_name, nationality } = req.body;
  if (!username || !password || !email || !first_name || !last_name || !nationality) {
    return res.status(400).json({ success: false, error: 'All required fields must be provided' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const {rows: userRows} = await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING league_id',
      [username, hashedPassword, email, 'Video Assistant Referee']
    );
    await pool.query(
      'INSERT INTO video_assistant_referee (com_mem_first_name, com_mem_last_name, nationality, league_id) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, nationality, userRows[0].league_id]
    );
    const {rows: userIdRows} = await pool.query(
      'SELECT * FROM video_assistant_referee WHERE league_id = $1', [userRows[0].league_id]
    );
    const user_id = userIdRows[0].com_mem_id;
    await pool.query(
      'UPDATE users SET id = $1 WHERE username = $2',
      [user_id, username]
    );
    res.status(201).json({ success: true, data: { message: 'Committee member registered' } });
  } catch (err) {
    if (err.code === '23505') res.status(409).json({ success: false, error: 'Username or email already taken' });
    else {
      console.log(err);
      console.log(err.message);
      console.log(err.code);
      next(err);}
  }
});

router.post('/register/committee_member/sponsor', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password, email, first_name, last_name, nationality } = req.body;
  if (!username || !password || !email || !first_name || !last_name || !nationality) {
    return res.status(400).json({ success: false, error: 'All required fields must be provided' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const {rows: userRows} = await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING league_id',
      [username, hashedPassword, email, 'Sponsor']
    );
    await pool.query(
      'INSERT INTO sponsor (com_mem_first_name, com_mem_last_name, nationality, league_id) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, nationality, userRows[0].league_id]
    );
    const {rows: userIdRows} = await pool.query(
      'SELECT * FROM sponsor WHERE league_id = $1', [userRows[0].league_id]
    );
    const user_id = userIdRows[0].com_mem_id;
    await pool.query(
      'UPDATE users SET id = $1 WHERE username = $2',
      [user_id, username]
    );
    res.status(201).json({ success: true, data: { message: 'Committee member registered' } });
  } catch (err) {
    if (err.code === '23505') res.status(409).json({ success: false, error: 'Username or email already taken' });
    else {
      console.log(err);
      console.log(err.message);
      console.log(err.code);
      next(err);}
  }
});

router.post('/register/spectator', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password, email, first_name, last_name, nationality } = req.body;
  if (!username || !password || !email || !first_name || !last_name || !nationality) {
    return res.status(400).json({ success: false, error: 'All required fields must be provided' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows: userRows } = await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING league_id',
      [username, hashedPassword, email, 'Spectator']
    );
    await pool.query(
      'INSERT INTO spectator (spectator_first_name, spectator_last_name, nationality, league_id) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, nationality, userRows[0].league_id]
    );
    const { rows: userIdRows } = await pool.query(
      'SELECT * FROM spectator WHERE league_id = $1', [userRows[0].league_id]
    );
    const user_id = userIdRows[0].spectator_id;
    await pool.query(
      'UPDATE users SET id = $1 WHERE username = $2',
      [user_id, username]
    );
    res.status(201).json({ success: true, data: { message: 'Spectator registered' } });
  } catch (err) {
    if (err.code === '23505') res.status(409).json({ success: false, error: 'Username or email already taken' });
    else {
      console.log(err);
      console.log(err.message);
      console.log(err.code);
      next(err);
    }
  }
});

router.get('/profile', authMiddleware, async (req, res, next) => {
  const pool = req.app.get('db');
  const userId = req.user.userid;
  const userRole = req.user.role;
  console.log(userId, userRole);
  try {
    // Fetch basic user info
    const { rows: userRows } = await pool.query(
      'SELECT username, email, role, created_at FROM users WHERE id = $1',
      [userId]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = userRows[0];
    const profileData = {
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };

    // Fetch role-specific details
    switch (userRole) {
      case 'Player': {
        const { rows: playerRows } = await pool.query(
          `SELECT p.com_first_name, p.com_last_name, p.age, p.com_street, p.postal_code, 
                  p.squad_number, p.position_player, p.weight, p.height, t.team_name
           FROM player p
           LEFT JOIN team t ON p.team_id = t.team_id
           WHERE p.com_id = $1`,
          [userId]
        );
        if (playerRows[0]) {
          profileData.player_info = playerRows[0];
        }
        break;
      }
      case 'Coach': {
        const { rows: coachRows } = await pool.query(
          `SELECT c.com_first_name, c.com_last_name, c.age, c.com_street, c.postal_code, 
                  c.coach_title, t.team_name
           FROM coach c
           LEFT JOIN team t ON c.team_id = t.team_id
           WHERE c.com_id = $1`,
          [userId]
        );
        if (coachRows[0]) {
          profileData.coach_info = coachRows[0];
        }
        break;
      }
      case 'Personal Doctor': {
        const { rows: doctorRows } = await pool.query(
          `SELECT pd.com_first_name, pd.com_last_name, pd.age, pd.com_street, pd.postal_code, 
                  pd.doctor_title, t.team_name, p.com_first_name AS player_first_name, 
                  p.com_last_name AS player_last_name
           FROM personal_doctor pd
           LEFT JOIN team t ON pd.team_id = t.team_id
           LEFT JOIN player p ON pd.supported_player_id = p.player_id
           WHERE pd.com_id = $1`,
          [userId]
        );
        if (doctorRows[0]) {
          profileData.doctor_info = doctorRows[0];
        }
        break;
      }
      case 'Club Doctor': {
        const { rows: clubDoctorRows } = await pool.query(
          `SELECT cd.com_first_name, cd.com_last_name, cd.age, cd.com_street, cd.postal_code, 
                  cd.doctor_title, t.team_name
           FROM club_doctor cd
           LEFT JOIN team t ON cd.team_id = t.team_id
           WHERE cd.com_id = $1`,
          [userId]
        );
        if (clubDoctorRows[0]) {
          profileData.club_doctor_info = clubDoctorRows[0];
        }
        break;
      }
      case 'Main Referee':
      case 'Match Manager':
      case 'Video Assistant Referee':
      case 'Sponsor':
      case 'Spectator': {
        const tableMap = {
          'Main Referee': 'main_referee',
          'Match Manager': 'match_manager',
          'Video Assistant Referee': 'video_assistant_referee',
          'Sponsor': 'sponsor',
          'Spectator': 'spectator',
        };
        const columnMap = {
          'Main Referee': { first_name: 'com_mem_first_name', last_name: 'com_mem_last_name', id: 'com_mem_id' },
          'Match Manager': { first_name: 'com_mem_first_name', last_name: 'com_mem_last_name', id: 'com_mem_id' },
          'Video Assistant Referee': { first_name: 'com_mem_first_name', last_name: 'com_mem_last_name', id: 'com_mem_id' },
          'Sponsor': { first_name: 'com_mem_first_name', last_name: 'com_mem_last_name', id: 'com_mem_id' },
          'Spectator': { first_name: 'spectator_first_name', last_name: 'spectator_last_name', id: 'spectator_id' },
        };
        const table = tableMap[userRole];
        const columns = columnMap[userRole];
        const { rows: committeeRows } = await pool.query(
          `SELECT ${columns.first_name}, ${columns.last_name}, nationality
           FROM ${table}
           WHERE ${columns.id} = $1`,
          [userId]
        );
        if (committeeRows[0]) {
          profileData.committee_info = {
            first_name: committeeRows[0][columns.first_name],
            last_name: committeeRows[0][columns.last_name],
            nationality: committeeRows[0].nationality,
          };
        }
        break;
      }
      case 'admin':
        // No additional info needed for admin
        break;
      default:
        break;
    }
    res.json({ success: true, data: profileData });
  } catch (err) {
    next(err);
  }
});

module.exports = router;