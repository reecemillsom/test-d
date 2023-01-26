import mongoose from 'mongoose';
import { Phase } from 'lib';
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

  describe('get', () => {
    let phases: Phase[];
    let phaseRepo: PhaseRepo;
    beforeAll(async () => {
      phases = await PhaseModel.create([
        {
          name: 'Phase 1',
        },
        {
          name: 'Phase 2',
        },
      ]);

      phaseRepo = new PhaseRepo();
      phaseRepo.phaseModel = PhaseModel;
    });

    it('will find the correct document successfully', async () => {
      const resultOne = await phaseRepo.get(phases[0]._id);
      const resultTwo = await phaseRepo.get(phases[1]._id);

      expect(resultOne).toEqual(
        expect.objectContaining({
          _id: phases[0]._id,
          name: 'Phase 1',
        })
      );

      expect(resultTwo).toEqual(
        expect.objectContaining({
          _id: phases[1]._id,
          name: 'Phase 2',
        })
      );
    });
  });

  describe('list', () => {
    let phases: Phase[];
    let phaseRepo: PhaseRepo;
    beforeAll(async () => {
      phases = await PhaseModel.create([
        {
          name: 'Phase 1',
        },
        {
          name: 'Phase 2',
        },
      ]);

      phaseRepo = new PhaseRepo();
      phaseRepo.phaseModel = PhaseModel;
    });

    it('will return all phases correctly', async () => {
      const result = await phaseRepo.list();
      const phaseOne = result.find(
        (res) => res._id.toString() === phases[0]._id.toString()
      );
      const phaseTwo = result.find(
        (res) => res._id.toString() === phases[1]._id.toString()
      );

      expect(phaseOne).toEqual(
        expect.objectContaining({
          _id: phases[0]._id,
          name: 'Phase 1',
        })
      );

      expect(phaseTwo).toEqual(
        expect.objectContaining({
          _id: phases[1]._id,
          name: 'Phase 2',
        })
      );
    });
  });

  describe('find', () => {
    let phaseRepo: PhaseRepo;
    beforeAll(async () => {
      await PhaseModel.create([
        {
          name: 'Phase 1',
          phaseNo: 1,
        },
      ]);

      phaseRepo = new PhaseRepo();
      phaseRepo.phaseModel = PhaseModel;
    });

    it('will find the document based on the filter', async () => {
      const resultOne = await phaseRepo.find({ phaseNo: 1 });
      const resultTwo = await phaseRepo.find({ name: 'Phase 1' });
      const resultThree = await phaseRepo.find({ name: 'Phase 1', phaseNo: 1 });

      const expected = expect.objectContaining({
        name: 'Phase 1',
        phaseNo: 1,
      });

      expect(resultOne).toEqual(expected);
      expect(resultTwo).toEqual(expected);
      expect(resultThree).toEqual(expected);
    });
  });

  describe('create', () => {
    describe('when creating a single document', () => {
      let phaseRepo: PhaseRepo;
      beforeAll(() => {
        phaseRepo = new PhaseRepo();
        phaseRepo.phaseModel = PhaseModel;
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
        phaseRepo = new PhaseRepo();
        phaseRepo.phaseModel = PhaseModel;
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

  describe('createTask', () => {
    let phase: Phase;
    let phaseRepo: PhaseRepo;
    beforeAll(async () => {
      phase = await PhaseModel.create({
        name: 'Phase 1',
      });

      phaseRepo = new PhaseRepo();
      phaseRepo.phaseModel = PhaseModel;
    });

    it('will add a task to a Phase', async () => {
      const phaseId = phase._id;
      const data = {
        name: 'Task 1',
      };
      const result = await phaseRepo.createTask(phaseId, data);

      expect(result).toEqual(
        expect.objectContaining({
          name: 'Phase 1',
          phaseNo: 1,
          tasks: [expect.objectContaining(data)],
          completed: false,
        })
      );
    });
  });

  describe('updateTaskCompletion', () => {
    let taskId: mongoose.Types.ObjectId;
    let phase: Phase;
    let phaseRepo: PhaseRepo;
    beforeAll(async () => {
      taskId = new mongoose.Types.ObjectId();

      phase = await PhaseModel.create({
        name: 'Phase 1',
        tasks: [
          {
            _id: taskId,
            name: 'Task 1',
            completed: false,
          },
        ],
      });

      phaseRepo = new PhaseRepo();
      phaseRepo.phaseModel = PhaseModel;
    });

    it('will update the task completion status correctly', async () => {
      const phaseId = phase._id;
      const data = { completed: true };

      const result = await phaseRepo.updateTaskCompletion(
        phaseId,
        taskId.toString(),
        data
      );

      expect(result).toEqual(
        expect.objectContaining({
          name: 'Phase 1',
          phaseNo: 1,
          completed: false,
          tasks: [
            expect.objectContaining({
              name: 'Task 1',
              completed: true,
            }),
          ],
        })
      );
    });
  });

  describe('updatePhaseCompletion', () => {
    let phase: Phase;
    let phaseRepo: PhaseRepo;
    beforeAll(async () => {
      phase = await PhaseModel.create({
        name: 'Foundation',
      });

      phaseRepo = new PhaseRepo();
      phaseRepo.phaseModel = PhaseModel;
    });

    it('will update the completed status successfully', async () => {
      expect(phase.completed).toBe(false);

      const data = { _id: phase._id, completed: true };
      const result = await phaseRepo.updatePhaseCompletion(data);

      expect(result.completed).toEqual(true);
    });
  });
});
