import { PhaseRepo } from './PhaseRepo';
import { connectToDb, disconnectDb } from '../utils';
import { databaseTestURI } from '../constants';

describe('PhaseRepo', () => {
  beforeAll(async () => {
    await connectToDb(databaseTestURI);
  });

  afterAll(async () => {
    await disconnectDb();
  });

  describe('create', () => {
    it('will create a phase successfully', () => {});
  });
});
