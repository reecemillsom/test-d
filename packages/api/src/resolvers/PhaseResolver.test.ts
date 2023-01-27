import { PhaseResolver } from './PhaseResolver';

describe('PhaseResolver', () => {
  describe('getPhase', () => {
    let phaseResolver: PhaseResolver;
    beforeAll(() => {
      const mockPhaseRepo: any = {
        get: jest.fn().mockResolvedValue({
          _id: 'someId',
          name: 'Phase 1',
          phaseNo: 1,
        }),
      };

      phaseResolver = new PhaseResolver(mockPhaseRepo);
    });

    it('will return the correct document', async () => {
      const result = await phaseResolver.getPhase('someId');

      expect(result).toEqual({
        _id: 'someId',
        name: 'Phase 1',
        phaseNo: 1,
      });
    });
  });

  describe('getPhases', () => {
    let phaseResolver: PhaseResolver;
    beforeAll(() => {
      const mockPhaseRepo: any = {
        list: jest.fn().mockResolvedValue([
          {
            _id: 'someId',
            name: 'Phase 1',
            phaseNo: 1,
          },
          {
            _id: 'someId2',
            name: 'Phase 2',
            phaseNo: 2,
          },
        ]),
      };

      phaseResolver = new PhaseResolver(mockPhaseRepo);
    });

    it('will return the correct documents', async () => {
      const result = await phaseResolver.getPhases();

      expect(result).toEqual([
        {
          _id: 'someId',
          name: 'Phase 1',
          phaseNo: 1,
        },
        {
          _id: 'someId2',
          name: 'Phase 2',
          phaseNo: 2,
        },
      ]);
    });
  });

  describe('createPhase', () => {
    let phaseResolver: PhaseResolver;
    beforeAll(() => {
      const phaseRepoMock: any = {
        create: jest.fn().mockReturnValue({
          _id: 'someId',
          name: 'Phase 1',
          phaseNo: 1,
        }),
      };

      phaseResolver = new PhaseResolver(phaseRepoMock);
    });

    it('will create the phase with the data passed', async () => {
      const data: any = { name: 'Phase 1' };

      const result = await phaseResolver.createPhase(data);

      expect(result).toEqual({
        _id: 'someId',
        name: 'Phase 1',
        phaseNo: 1,
      });
    });
  });

  describe('createTask', () => {
    let phaseResolver: PhaseResolver;
    beforeAll(() => {
      const phaseRepoMock: any = {
        createTask: jest.fn().mockResolvedValue({
          _id: 'phaseId',
          name: 'Phase 1',
          completed: false,
          tasks: [
            {
              _id: 'someId',
              name: 'Task 1',
              completed: false,
            },
          ],
        }),
      };

      phaseResolver = new PhaseResolver(phaseRepoMock);
    });

    it("will create a task and return the phase document it's in", async () => {
      const taskData = { phaseId: 'phaseId', name: 'Task 1' };
      const result = await phaseResolver.createTask(taskData);

      expect(result).toEqual({
        _id: 'phaseId',
        name: 'Phase 1',
        completed: false,
        tasks: [
          {
            _id: 'someId',
            name: 'Task 1',
            completed: false,
          },
        ],
      });
    });
  });

  describe('updateTaskCompletedStatus', () => {
    let phaseResolver: PhaseResolver;
    beforeAll(() => {
      const mockPhaseRepo: any = {
        updateTaskCompletion: jest.fn().mockResolvedValue({
          _id: 'someId',
          name: 'Phase 1',
          phaseNo: 1,
          completed: true,
          tasks: [
            {
              _id: 'taskId',
              name: 'Task 1',
              completed: true,
            },
          ],
        }),
      };

      phaseResolver = new PhaseResolver(mockPhaseRepo);
    });

    it('will update the task and return the phase document', async () => {
      const data = { phaseId: 'someId', taskId: 'taskId', completed: true };
      const result = await phaseResolver.updateTaskCompletedStatus(data);

      expect(result.tasks).toEqual([
        {
          _id: 'taskId',
          name: 'Task 1',
          completed: true,
        },
      ]);
    });
  });
});
