const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'contacts_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;

// Function to connect to the database with retry logic
async function connectWithRetry(maxRetries = 10, delay = 5000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      
      pool = mysql.createPool(dbConfig);
      
      const connection = await pool.getConnection();
      connection.release();
      return pool;
      
    } catch (error) {
      
      if (pool) {
        await pool.end();
        pool = null;
      }
      
      if (i === maxRetries - 1) {
        throw new Error(`cannot connect to the database after ${maxRetries} attempts: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function initDatabase() {
  try {

    if (!pool) {
      await connectWithRetry();
    }
    
    const connection = await pool.getConnection();
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact VARCHAR(9) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        picture VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    connection.release();
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}


function getPool() {
  if (!pool) {
    throw new Error('Database connection pool is not initialized. Call connectWithRetry() first.');
  }
  return pool;
}

module.exports = { 
  get pool() {
    return getPool();
  },
  initDatabase, 
  connectWithRetry 
};