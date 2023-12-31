import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGODB_URI

async function main() {
  if (!mongoDB) {
    throw new Error("MongoDB URI is not defined");
  }

  await mongoose.connect(mongoDB);
}

export function connectToDb() {
  return main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}