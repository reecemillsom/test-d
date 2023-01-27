import { Service } from 'typedi';
import { Phase, Task } from 'lib';
import { every } from 'lodash';
import { PhaseRepo } from '../repos/PhaseRepo';

// TODO didn't add tests for any many functions in this class,
// as it's just forwarding data etc..
// I created this layer incase there was more business logic that was needed,
// and didn't want to pollute the db queries in repo.

interface UpdateTaskData {
  phaseId: string;
  taskId: string;
  completed: boolean;
}

@Service()
export class PhaseService {
  public phaseRepo: PhaseRepo;
  constructor() {
    this.phaseRepo = new PhaseRepo();
  }

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

  public async updateTaskCompletion(data: UpdateTaskData): Promise<Phase> {
    if (data.completed) {
      return this.handleTruthyCompletedStatus(data);
    }

    return this.handleFalsyCompletedStatus(data);
  }

  private async handleTruthyCompletedStatus({
    phaseId,
    taskId,
    ...completed
  }: UpdateTaskData): Promise<Phase> {
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

  private async handleFalsyCompletedStatus({
    phaseId,
    taskId,
    ...completed
  }: UpdateTaskData): Promise<Phase> {
    const phase = await this.phaseRepo.get(phaseId);
    const nextPhases = await this.phaseRepo.findMany({
      _id: { $ne: phaseId },
      phaseNo: { $gt: phase.phaseNo },
    });

    if (nextPhases.length) {
      const nextPhaseIds = nextPhases.map((nextPhase) =>
        nextPhase._id.toString()
      );
      await this.phaseRepo.updatePhaseAndTasksCompletedFalse(nextPhaseIds);
    }

    await this.phaseRepo.updatePhaseCompletion({
      completed: false,
      _id: phaseId,
    });

    return await this.phaseRepo.updateTaskCompletion(
      phaseId,
      taskId,
      completed
    );
  }
}
