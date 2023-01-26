import { Service } from 'typedi';
import { Phase, Task } from 'lib';
import { every } from 'lodash';
import { PhaseRepo } from '../repos/PhaseRepo';

/* TODO didn't add tests for any other function other than updateTaskCompletion for this class,
     as it's just forwarding data etc..
     I created this layer incase there was more business logic that was needed,
      and didn't want to pollute the db queries in repo.
 */

@Service()
export default class PhaseService {
  constructor(private phaseRepo: PhaseRepo) {}

  public async get(phaseId: string): Promise<Phase> {
    return this.phaseRepo.get(phaseId);
  }

  public async list(): Promise<Phase[]> {
    return this.phaseRepo.list();
  }

  public async find(filter: Partial<Omit<Phase, '_id'>>): Promise<Phase> {
    return this.phaseRepo.findOne(filter);
  }

  public async create(data: Pick<Phase, 'name'>): Promise<Phase> {
    return this.phaseRepo.create(data);
  }

  public async createTask(phaseId: string, data: Pick<Task, 'name'>) {
    return this.phaseRepo.createTask(phaseId, data);
  }

  public async updateTaskCompletion(data: {
    phaseId: string;
    taskId: string;
    completed: boolean;
  }): Promise<Phase> {
    const { phaseId, taskId, ...completed } = data;
    const phase = await this.phaseRepo.get(phaseId);
    const previousPhase = await this.phaseRepo.findOne({
      phaseNo: phase.phaseNo - 1,
    });

    if (previousPhase && !previousPhase.completed) {
      throw new Error(
        "Cannot mark this task as completed, as previous phase isn't finished"
      );
    }

    const updatedPhase = await this.phaseRepo.updateTaskCompletion(
      phaseId,
      taskId,
      completed
    );

    return updatedPhase.tasks.length &&
      every(updatedPhase.tasks, ['completed', true])
      ? this.phaseRepo.updatePhaseCompletion({ completed: true, _id: phaseId })
      : updatedPhase;
  }
}
