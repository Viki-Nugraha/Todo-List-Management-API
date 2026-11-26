
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB berhasil terhubung!');
    console.log('Host:', conn.connection.host);
    console.log('Status koneksi:', conn.connection.readyState);

    return conn;
  } catch (error) {
    console.error('Koneksi MongoDB gagal:', error.message);
    throw error;
  }
};

module.exports = connectDB;
