import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
    console.log("Ready State:", mongoose.connection.readyState);
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    console.log("Collections:", collections);

  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default connectToMongoDB;