// SQLite implementation (replacing MongoDB)
const Database = require('./db');
let databaseInstance = null;

const initializeDatabase = async () => {
  try {
    if (!databaseInstance) {
      databaseInstance = new Database();
      await databaseInstance.initialize();
    }
    console.log('Database SQLite initialized successfully');
    return databaseInstance;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

module.exports = {
  initializeDatabase,
  getDatabase: () => databaseInstance
};
