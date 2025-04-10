const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('./middleware');

router.post('/login', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, error: 'Username and password required' });
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ 
        userid: user.id, 
        role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' });
      
        res.json({ success: true, data: { token, role: user.role } });
    } 
    else {
      res.status(401).json({ success: false, error: 'Incorrect username or password' });
    }
  } catch (err) {
    next(err);
  }
});

router.post('/register/admin', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password, email, key} = req.body;
  if  (key !== process.env.ADMIN_KEY) return res.status(403).json({ success: false, error: 'Invalid key, access denied. You must be an admin to register new admins.' });
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
    else next(err);
  }
});


router.post('/register/team_member/player', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password, email, 
    first_name, last_name, age, com_street, 
    postal_code, squad_number, position_player,
    weight, height, team_name } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ success: false, error: 'Username, password, and email required' });
  }
  if (!first_name || !last_name ||
    !position_player || !weight || !height || !team_name) {
    return res.status(400).json({ success: false, error: 'First name, last name, position, weight, height and team name required' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const { row_team } = await pool.query(`
      SELECT * FROM team WHERE name = $1`, [team_name]);
  const team_id = row_team[0].team_id;
  if (!team_id) {
    return res.status(400).json({ success: false, error: 'Team not found' });
  }
  try {
    await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4, $5)',
      [username, hashedPassword, email, 'Player']
    );
    await pool.query(
      `INSERT INTO player (first_name, last_name, age, com_street, 
      postal_code, squad_number, position_player, weight, height, team_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [first_name, last_name, age,
        com_street,
        postal_code,
        squad_number,
        position_player,
        weight,
        height,
        team_id]
    );
    res.status(201).json({ success: true, data: { message: 'Team member registered' } });
  }
  catch (err) {
    if (err.code === '23505') res.status(409).json({ success: false, error: 'Username or email already taken' });
    else next(err);
  }
});

router.post('/register/team_member/coach', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password, email, 
    first_name, last_name, age, 
    com_street, postal_code, team_name, coach_title } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ success: false, error: 'Username, password, and email required' });
  }
  if (!first_name || !last_name || !team_name || !coach_title) {
    return res.status(400).json({ success: false, error: 'First name, last name, team name and coach title required' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const { row } = await pool.query(`
      SELECT * FROM team WHERE name = $1`, [team_name]);
  const team_id = row[0].team_id;
  if (!team_id) {
    return res.status(400).json({ success: false, error: 'Team not found' });
  }
  try {
    await pool.query(
    `INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4, $5)`,
      [username, hashedPassword, email, 'Coach']
    );

    await pool.query(
    `INSERT INTO coach (first_name, last_name, age, com_street, postal_code, coach_title, team_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [first_name, last_name, age,
        com_street,
        postal_code,
        coach_title,
        team_id]
    );
    res.status(201).json({ success: true, data: { message: 'Team member registered' } });
  }
  catch (err) {
    if (err.code === '23505') res.status(409).json({ success: false, error: 'Username or email already taken' });
    else next(err);
  }
});

router.post('/register/team_member/personal_doctor', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password, email,
    first_name, last_name, age, 
    com_street, postal_code, team_name, doctor_title, supported_player_id } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ success: false, error: 'Username, password, and email required' });
  }
  if (!first_name || !last_name || !team_name || !doctor_title) {
    return res.status(400).json({ success: false, error: 'First name, last name, team name and doctor title required' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const { row } = await pool.query(`
      SELECT * FROM team WHERE name = $1`, [team_name]);
  const team_id = row[0].team_id;
  if (!team_id) {
    return res.status(400).json({ success: false, error: 'Team not found' });
  }
  const { row_player } = await pool.query(`
      SELECT * FROM player WHERE player_id = $1`, [supported_player_id]);
  const player_id = row_player[0].player_id;
  if (!player_id) {
    return res.status(400).json({ success: false, error: 'Player you are supporting not found' });
  }
  try {
    await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4, $5)',
      [username, hashedPassword, email, 'Personal Doctor']
    );
    await pool.query(
      'INSERT INTO personal_doctor (first_name, last_name, age, com_street, postal_code, doctor_title) VALUES ($1, $2, $3, $4, $5, $6)',
      [first_name, last_name, age,
        com_street,
        postal_code,
        doctor_title]
    );
    res.status(201).json({ success: true, data: { message: 'Team member registered' } });
  }
  catch (err) {
    if (err.code === '23505') res.status(409).json({ success: false, error: 'Username or email already taken' });
    else next(err);
  }
});

router.post('/register/team_member/club_doctor', async (req, res, next) => {
  const pool = req.app.get('db');
  const { username, password, email,
    first_name, last_name, age, 
    com_street, postal_code, team_name, doctor_title } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ success: false, error: 'Username, password, and email required' });
  }
  if (!first_name || !last_name || !team_name || !doctor_title) {
    return res.status(400).json({ success: false, error: 'First name, last name, team name and doctor title required' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const { row } = await pool.query(`
      SELECT * FROM team WHERE name = $1`, [team_name]);
  const team_id = row[0].team_id;
  if (!team_id) {
    return res.status(400).json({ success: false, error: 'Team not found' });
  }
  try {
    await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4, $5)',
      [username, hashedPassword, email, 'Club Doctor']
    );
    await pool.query(`
      INSERT INTO club_doctor (first_name, last_name, age, 
      com_street, postal_code, doctor_title, team_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [first_name, last_name, age,
        com_street,
        postal_code,
        doctor_title,
        team_id]
    );
    res.status(201).json({ success: true, data: { message: 'Team member registered' } });
  }
  catch (err) {
    if (err.code === '23505') res.status(409).json({ success: false, error: 'Username or email already taken' });
    else next(err);
  }
});


  


router.get('/profile', authMiddleware, async (req, res, next) => {
  const pool = req.app.get('db');
  try {
    const { rows } = await pool.query('SELECT username, email, role, team_id, created_at FROM users WHERE id = $1', [req.user.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;