module.exports = async (pool) => {
  try {
    // authentication: users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        league_id SERIAL PRIMARY KEY,
        id VARCHAR(30),
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,  -- e.g., 'main_referee', 'player', 'admin'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables created or verified');
  } catch (err) {
    console.error('Error setting up database:', err);
    throw err;
  }
};