const mongoose = require("mongoose");
const config = require("../utils/config");

const connectDB = async () => {
  try {
    const mongoUri = process.env.NODE_ENV === "test" ? process.env.TEST_MONGO_URI : config.MONGO_URI;
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
