import { Phase } from 'types';
import { PhaseRepo } from './PhaseRepo';
import { connectToDb, disconnectDb, dropCollections } from '../utils';
import { databaseTestURI } from '../constants';
import { PhaseModel } from '../models';

describe('PhaseRepo', () => {
  beforeAll(async () => {
    await connectToDb(databaseTestURI);
  });

  afterAll(async () => {
    await disconnectDb();
  });

  afterEach(async () => {
    await dropCollections();
  });

  describe('create', () => {
    describe('when creating a single document', () => {
      let phaseRepo: PhaseRepo;
      beforeAll(() => {
        phaseRepo = new PhaseRepo(PhaseModel);
      });

      it('will create a phase successfully', async () => {
        const data = { name: 'Foundation' };

        expect(await phaseRepo.create(data)).toEqual(
          expect.objectContaining({
            name: 'Foundation',
            phaseNo: 1,
            tasks: [],
            completed: false,
          })
        );
      });
    });

    describe('when creating multiple documents', () => {
      let phaseRepo: PhaseRepo;
      beforeAll(() => {
        phaseRepo = new PhaseRepo(PhaseModel);
      });

      it('will create phases with auto increments phase numbers', async () => {
        const data = { name: 'Foundation' };
        const resultOne = await phaseRepo.create(data);
        const resultTwo = await phaseRepo.create(data);

        expect(resultOne.phaseNo).toBe(1);
        expect(resultTwo.phaseNo).toBe(2);
      });
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
