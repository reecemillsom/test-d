import { PhaseService } from './PhaseService';

describe('PhaseService', () => {
  describe('get', () => {
    describe('when no phase exists with that id', () => {
      let phaseService: PhaseService;
      beforeAll(() => {
        const phaseRepo: any = {
          get: jest.fn().mockResolvedValue(null),
        };

        phaseService = new PhaseService();
        phaseService.phaseRepo = phaseRepo;
      });

      it('will return a error stating no phase exists', async () => {
        await expect(phaseService.get('someId')).rejects.toThrowError(
          'Phase with id someId does not exist'
        );
      });
    });

    describe('when a phase exists with that id', () => {
      let phaseService: PhaseService;
      beforeAll(() => {
        const phaseRepo: any = {
          get: jest.fn().mockResolvedValue({
            _id: 'phaseId',
          }),
        };

        phaseService = new PhaseService();
        phaseService.phaseRepo = phaseRepo;
      });

      it('will return the phase', async () => {
        const result = await phaseService.get('phaseId');
        expect(result).toEqual({
          _id: 'phaseId',
        });
      });
    });
  });

  describe('createTask', () => {
    describe('when no phase is found', () => {
      let phaseService: PhaseService;
      beforeAll(() => {
        const phaseRepo: any = {
          get: jest.fn().mockResolvedValue(null),
        };

        phaseService = new PhaseService();
        phaseService.phaseRepo = phaseRepo;
      });

      it('will throw a error', async () => {
        const data = { name: 'Task 1' };
        await expect(
          phaseService.createTask('phaseId', data)
        ).rejects.toThrowError('Phase with id phaseId does not exist');
      });
    });

    describe('when a phase is found', () => {
      let phaseService: PhaseService;
      beforeAll(() => {
        const phaseRepo: any = {
          get: jest.fn().mockResolvedValue({
            _id: 'phaseId',
          }),
          createTask: jest.fn().mockResolvedValue({
            _id: 'phaseId',
            tasks: [
              {
                _id: 'taskId',
                name: 'Task 1',
                completed: false,
              },
            ],
          }),
        };

        phaseService = new PhaseService();
        phaseService.phaseRepo = phaseRepo;
      });

      it('will create the task and return the phase', async () => {
        const data = { name: 'Task 1' };
        const result = await phaseService.createTask('phaseId', data);

        expect(result).toEqual({
          _id: 'phaseId',
          tasks: [
            {
              _id: 'taskId',
              name: 'Task 1',
              completed: false,
            },
          ],
        });
      });
    });
  });

  describe('updateTaskCompletion', () => {
    describe('when no phase is found ', () => {
      let phaseRepo: any;
      let phaseService: PhaseService;
      beforeAll(() => {
        phaseRepo = {
          get: jest.fn().mockResolvedValue(null),
        };

        phaseService = new PhaseService();
        phaseService.phaseRepo = phaseRepo;
      });

      it('will throw an error', async () => {
        const data = {
          phaseId: 'phaseId',
          taskId: 'taskId',
          completed: true,
        };

        await expect(
          phaseService.updateTaskCompletion(data)
        ).rejects.toThrowError('Phase with id phaseId does not exist');
      });
    });

    describe('when no task is found', () => {
      let phaseRepo: any;
      let phaseService: PhaseService;
      beforeAll(() => {
        phaseRepo = {
          get: jest.fn().mockResolvedValue({
            tasks: [],
          }),
        };

        phaseService = new PhaseService();
        phaseService.phaseRepo = phaseRepo;
      });

      it('will throw an error', async () => {
        const data = { phaseId: 'phaseId', taskId: 'taskId', completed: true };

        await expect(
          phaseService.updateTaskCompletion(data)
        ).rejects.toThrowError(
          'Task with id taskId does not exist for this phase'
        );
      });
    });

    describe('when a phase and task is found', () => {
      describe('when completed wants to be set to true', () => {
        describe('when a previous phase does not exist', () => {
          let phaseRepo: any;
          let phaseService: PhaseService;
          beforeAll(() => {
            phaseRepo = {
              get: jest.fn().mockResolvedValue({
                _id: 'phaseId',
                phaseNo: 1,
                tasks: [
                  {
                    _id: 'taskId',
                  },
                ],
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
                      _id: 'taskId1',
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
                "Cannot mark task taskId1 as completed, as previous phase isn't completed"
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
                      _id: 'taskId1',
                      completed: false,
                    },
                    {
                      _id: 'taskId2',
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
                _id: 'taskId1',
                completed: false,
              },
              {
                _id: 'taskId2',
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
                tasks: [
                  {
                    _id: 'taskId',
                    completed: true,
                  },
                ],
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

        describe('when next phases do exist', () => {
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
              taskId: 'task1Id',
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
});
