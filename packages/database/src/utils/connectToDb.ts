import mongoose from 'mongoose';
import { databaseErrors, databaseURI } from '../constants';
import { replaceTextInString } from './replaceTextInString';

const { connect, connection } = mongoose;

export async function connectToDb(mongoURI: string = databaseURI) {
  try {
    await connect(mongoURI);
  } catch (error) {
    throw new Error(
      replaceTextInString(databaseErrors.FAILED_TO_CONNECT, error)(/:reason:/)
    );
  }
}

connection.on('error', (error) => {
  console.error(
    replaceTextInString(
      databaseErrors.ERROR_AFTER_CONNECTION,
      error
    )(/:reason:/)
  );
});
