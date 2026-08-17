const mongoose = require('mongoose');

const connectMongoDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.BACK4APP_DATABASE_URL;
  if (!uri) {
    throw new Error('MONGODB_URI ou BACK4APP_DATABASE_URL não configurada');
  }

  await mongoose.connect(uri);
  console.log('MongoDB conectado com sucesso');
};

module.exports = { connectMongoDB };
