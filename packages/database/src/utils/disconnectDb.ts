import mongoose from 'mongoose';

export async function disconnectDb() {
  await mongoose.disconnect();
}
