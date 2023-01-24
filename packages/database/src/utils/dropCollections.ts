import mongoose from 'mongoose';

const { connection } = mongoose;

export async function dropCollections(): Promise<void> {
  const collections = await connection.db.collections();
  const dropCollections = collections.map((collection) => collection.drop());

  await Promise.all(dropCollections);
}
