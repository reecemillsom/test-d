import { Phase } from 'types';
import { PhaseRepo } from './PhaseRepo';
import { connectToDb, disconnectDb } from '../utils';
import { databaseTestURI } from '../constants';
import { PhaseModel } from '../models/PhaseModel';

describe('PhaseRepo', () => {
  beforeAll(async () => {
    await connectToDb(databaseTestURI);
  });

  afterAll(async () => {
    await disconnectDb();
  });

  describe('create', () => {
    let phaseRepo: PhaseRepo;
    beforeAll(() => {
      phaseRepo = new PhaseRepo(PhaseModel);
    });

    it('will create a phase successfully', async () => {
      const data = { name: 'Foundation' };

      expect(await phaseRepo.create(data)).toEqual(
        expect.objectContaining({
          name: 'Foundation',
          phaseNo: 0,
          tasks: [],
          completed: false,
        })
      );
    });
  });

  describe('updateCompleted', () => {
    let phase: Phase;
    let phaseRepo: PhaseRepo;
    beforeAll(async () => {
      phase = await PhaseModel.create({
        name: 'Foundation',
      });

      phaseRepo = new PhaseRepo(PhaseModel);
    });

    it('will update the completed status successfully', async () => {
      expect(phase.completed).toBe(false);

      const data = { _id: phase._id, completed: true };
      const result = await phaseRepo.updateCompleted(data);

      expect(result.completed).toEqual(true);
    });
  });
});
