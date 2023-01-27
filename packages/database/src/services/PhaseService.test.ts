import { PhaseService } from './PhaseService';

describe('PhaseService', () => {
  describe('updateTaskCompletion', () => {
    describe('when completed wants to be set to true', () => {
      describe('when a previous phase does not exist', () => {
        let phaseRepo: any;
        let phaseService: PhaseService;
        beforeAll(() => {
          phaseRepo = {
            get: jest.fn().mockResolvedValue({
              _id: 'phaseId',
              phaseNo: 1,
            }),
            findOne: jest.fn().mockResolvedValue(null),
            updateTaskCompletion: jest.fn().mockResolvedValue({
              tasks: [],
            }),
          };

          phaseService = new PhaseService();
          phaseService.phaseRepo = phaseRepo;
        });

        it('will mark the task as completed', async () => {
          const data = {
            phaseId: 'phaseId',
            taskId: 'taskId',
            completed: true,
          };

          await phaseService.updateTaskCompletion(data);

          expect(phaseRepo.updateTaskCompletion).toHaveBeenCalledWith(
            'phaseId',
            'taskId',
            { completed: true }
          );
        });
      });

      describe('when a previous phase does exist', () => {
        describe('when the previous phase is not marked as completed', () => {
          let phaseRepo: any;
          let phaseService: PhaseService;
          beforeAll(() => {
            phaseRepo = {
              get: jest.fn().mockResolvedValue({
                _id: 'phaseId2',
                name: 'Phase 2',
                phaseNo: 2,
                tasks: [
                  {
                    name: 'A',
                    completed: false,
                  },
                  {
                    name: 'B',
                    completed: false,
                  },
                ],
              }),
              findOne: jest.fn().mockResolvedValue({
                name: 'Phase 1',
                phaseNo: 1,
                completed: false,
                tasks: [
                  {
                    name: 'A',
                    completed: false,
                  },
                  {
                    name: 'B',
                    completed: true,
                  },
                ],
              }),
              updateTaskCompletion: jest.fn(),
            };

            phaseService = new PhaseService();
            phaseService.phaseRepo = phaseRepo;
          });

          it('will throw a error', async () => {
            const data = {
              phaseId: 'phaseId2',
              taskId: 'taskId1',
              completed: true,
            };

            await expect(
              phaseService.updateTaskCompletion(data)
            ).rejects.toThrow(
              "Cannot mark this task as completed, as previous phase isn't finished"
            );
          });
        });

        describe('when the previous phase is marked as completed', () => {
          let phaseRepo: any;
          let phaseService: PhaseService;
          beforeAll(() => {
            phaseRepo = {
              get: jest.fn().mockResolvedValue({
                _id: 'phaseId2',
                name: 'Phase 2',
                phaseNo: 2,
                tasks: [
                  {
                    name: 'taskId1',
                    completed: false,
                  },
                  {
                    name: 'taskId2',
                    completed: false,
                  },
                ],
              }),
              findOne: jest.fn().mockResolvedValue({
                name: 'Phase 1',
                phaseNo: 1,
                completed: true,
                tasks: [
                  {
                    name: 'A',
                    completed: true,
                  },
                  {
                    name: 'B',
                    completed: true,
                  },
                ],
              }),
              updateTaskCompletion: jest.fn().mockResolvedValue({
                tasks: [],
              }),
            };

            phaseService = new PhaseService();
            phaseService.phaseRepo = phaseRepo;
          });

          it('will update the task', async () => {
            const data = {
              phaseId: 'phaseId2',
              taskId: 'taskId1',
              completed: true,
            };

            await phaseService.updateTaskCompletion(data);

            expect(phaseRepo.updateTaskCompletion).toHaveBeenCalledWith(
              'phaseId2',
              'taskId1',
              { completed: true }
            );
          });
        });
      });

      describe('when all tasks are marked as completed', () => {
        let phaseRepo: any;
        let phaseService: PhaseService;
        beforeAll(() => {
          const tasks = [
            {
              name: 'taskId1',
              completed: false,
            },
            {
              name: 'taskId2',
              completed: true,
            },
          ];

          phaseRepo = {
            get: jest.fn().mockResolvedValue({
              _id: 'phaseId2',
              name: 'Phase 2',
              phaseNo: 2,
              tasks,
            }),
            findOne: jest.fn().mockResolvedValue({
              name: 'Phase 1',
              phaseNo: 1,
              completed: true,
              tasks: [
                {
                  name: 'A',
                  completed: true,
                },
                {
                  name: 'B',
                  completed: true,
                },
              ],
            }),
            updateTaskCompletion: jest.fn().mockResolvedValue({
              _id: 'phaseId2',
              name: 'Phase 2',
              phaseNo: 2,
              tasks: [
                {
                  name: 'taskId1',
                  completed: true,
                },
                {
                  name: 'taskId2',
                  completed: true,
                },
              ],
            }),
            updatePhaseCompletion: jest.fn(),
          };

          phaseService = new PhaseService();
          phaseService.phaseRepo = phaseRepo;
        });

        it('will mark the phase as completed', async () => {
          const data = {
            phaseId: 'phaseId2',
            taskId: 'taskId1',
            completed: true,
          };

          await phaseService.updateTaskCompletion(data);

          expect(phaseRepo.updatePhaseCompletion).toHaveBeenCalledWith({
            _id: data.phaseId,
            completed: true,
          });
        });
      });
    });

    describe('when completed wants to be set to false', () => {
      describe("when a next phase doesn't exist", () => {
        let phaseRepo: any;
        let phaseService: PhaseService;
        beforeAll(() => {
          phaseRepo = {
            get: jest.fn().mockResolvedValue({
              _id: 'phaseId',
              phaseNo: 1,
            }),
            findMany: jest.fn().mockResolvedValue([]),
            updateTaskCompletion: jest.fn(),
            updatePhaseCompletion: jest.fn(),
          };

          phaseService = new PhaseService();
          phaseService.phaseRepo = phaseRepo;
        });

        it('will make the task not completed ', async () => {
          const data = {
            phaseId: 'phaseId',
            taskId: 'taskId',
            completed: false,
          };

          await phaseService.updateTaskCompletion(data);

          expect(phaseRepo.updateTaskCompletion).toHaveBeenCalledWith(
            'phaseId',
            'taskId',
            { completed: false }
          );
        });
      });

      describe('when a next phases do exist', () => {
        let phaseRepo: any;
        let phaseService: PhaseService;
        beforeAll(() => {
          phaseRepo = {
            get: jest.fn().mockResolvedValue({
              _id: 'phaseId',
              phaseNo: 1,
              completed: true,
              tasks: [
                {
                  _id: 'task1Id',
                  completed: true,
                },
              ],
            }),
            findMany: jest.fn().mockResolvedValue([
              {
                _id: 'phase2Id',
                phaseNo: 2,
                completed: true,
                tasks: [
                  {
                    _id: 'task1Id',
                    completed: true,
                  },
                  {
                    _id: 'task2Id',
                    completed: true,
                  },
                ],
              },
              {
                _id: 'phase3Id',
                phaseNo: 3,
                completed: true,
                tasks: [
                  {
                    _id: 'task1Id',
                    completed: true,
                  },
                ],
              },
            ]),
            updateTaskCompletion: jest.fn(),
            updatePhaseCompletion: jest.fn(),
            updatePhaseAndTasksCompletedFalse: jest.fn(),
          };

          phaseService = new PhaseService();
          phaseService.phaseRepo = phaseRepo;
        });

        it('will set the next phases to completed false & unset completed tasks', async () => {
          const data = {
            phaseId: 'phaseId',
            taskId: 'taskId',
            completed: false,
          };

          await phaseService.updateTaskCompletion(data);

          expect(
            phaseRepo.updatePhaseAndTasksCompletedFalse
          ).toHaveBeenCalledWith(['phase2Id', 'phase3Id']);
        });
      });
    });
  });
});
