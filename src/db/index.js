// Database initialization module
const { Database } = require('./db');
let databaseInstance = null;
let initializationPromise = null;

const initializeDatabase = async () => {
  if (databaseInstance && databaseInstance._initialized) {
    return databaseInstance;
  }
  
  if (initializationPromise) {
    return await initializationPromise;
  }
  
  initializationPromise = (async () => {
    try {
      console.log('Creating Database instance...');
      console.log('Database class available:', Database);
      console.log('Database class type:', typeof Database);
      databaseInstance = new Database();
      console.log('Database instance created:', databaseInstance);
      await databaseInstance.initialize();
      console.log('Database SQLite initialized successfully');
      return databaseInstance;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      databaseInstance = null;
      throw error;
    } finally {
      initializationPromise = null;
    }
  })();
  
  return await initializationPromise;
};

module.exports = {
  initializeDatabase,
  getDatabase: () => databaseInstance
};