import { Service } from 'typedi';
import { Phase, Task } from 'lib';
import { every } from 'lodash';
import { PhaseRepo } from '../repos/PhaseRepo';
import { services as constants } from '../constants';
import { replaceTextInString } from '../utils';

// TODO didn't add tests for all functions in this class,
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
    const phase = await this.phaseRepo.get(phaseId);

    if (!phase) {
      throw new Error(
        replaceTextInString(constants.CANNOT_FIND_PHASE, phaseId)(/:phaseId:/)
      );
    }

    return phase;
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
    const phase = await this.phaseRepo.get(phaseId);

    if (!phase) {
      throw new Error(
        replaceTextInString(constants.CANNOT_FIND_PHASE, phaseId)(/:phaseId:/)
      );
    }

    return this.phaseRepo.createTask(phaseId, data);
  }

  public async updateTaskCompletion(data: UpdateTaskData): Promise<Phase> {
    const phase = await this.phaseRepo.get(data.phaseId);

    if (!phase) {
      throw new Error(
        replaceTextInString(
          constants.CANNOT_FIND_PHASE,
          data.phaseId
        )(/:phaseId:/)
      );
    }

    const doesTaskExist = phase.tasks?.find(
      (task) => task._id.toString() === data.taskId
    );

    if (!doesTaskExist) {
      throw new Error(
        replaceTextInString(constants.CANNOT_FIND_TASK, data.taskId)(/:taskId:/)
      );
    }

    if (data.completed) {
      return this.handleTruthyCompletedStatus(data, phase);
    }

    return this.handleFalsyCompletedStatus(data, phase);
  }

  private async handleTruthyCompletedStatus(
    { phaseId, taskId, ...completed }: UpdateTaskData,
    phase: Phase
  ): Promise<Phase> {
    const previousPhase = await this.phaseRepo.findOne({
      phaseNo: phase.phaseNo - 1,
    });

    if (previousPhase && !previousPhase.completed) {
      throw new Error(
        replaceTextInString(constants.CANNOT_COMPLETED_TASK, taskId)(/:taskId:/)
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

  private async handleFalsyCompletedStatus(
    { phaseId, taskId, ...completed }: UpdateTaskData,
    phase: Phase
  ): Promise<Phase> {
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
