import { Task } from 'types';
import { TaskRepo } from './TaskRepo';
import { connectToDb, disconnectDb, dropCollections } from '../utils';
import { databaseTestURI } from '../constants';
import { TaskModel } from '../models';

describe('TaskRepo', () => {
  beforeAll(async () => {
    await connectToDb(databaseTestURI);
    await dropCollections();
  });

  afterAll(async () => {
    await disconnectDb();
  });

  describe('create', () => {
    let taskRepo: TaskRepo;
    beforeAll(() => {
      taskRepo = new TaskRepo(TaskModel);
    });

    it('will create a task successfully', async () => {
      const data = { name: 'Setup virtual office' };

      expect(await taskRepo.create(data)).toEqual(
        expect.objectContaining({
          name: data.name,
          completed: false,
        })
      );
    });
  });

  describe('updateCompleted', () => {
    let task: Task;
    let taskRepo: TaskRepo;
    beforeAll(async () => {
      task = await TaskModel.create({
        name: 'Setup virtual office',
      });

      taskRepo = new TaskRepo(TaskModel);
    });

    it('will update the completed status correctly', async () => {
      expect(task.completed).toBe(false);

      const data = { _id: task._id, completed: true };

      const result = await taskRepo.updateCompleted(data);

      expect(result).toEqual(
        expect.objectContaining({
          name: 'Setup virtual office',
          completed: true,
        })
      );
    });
  });
});
