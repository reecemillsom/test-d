import { Model } from 'mongoose';
import { Phase, Task } from 'types';

export class PhaseRepo {
  constructor(private phaseModel: Model<Phase>) {}

  public async create(data: Pick<Phase, 'name'>): Promise<Phase> {
    return this.phaseModel.create(data);
  }

  public async createTask(phaseId: string, data: Task) {
    return this.phaseModel.findOneAndUpdate(
      {
        _id: phaseId,
      },
      {
        $push: { tasks: data },
      },
      { new: true }
    );
  }

  public async updateTaskCompletion(
    phaseId: string,
    taskId: string,
    data: Pick<Task, 'completed'>
  ) {
    return this.phaseModel.findOneAndUpdate(
      {
        _id: phaseId,
        'tasks._id': taskId,
      },
      {
        $set: {
          'tasks.$.completed': data.completed,
        },
      },
      { new: true }
    );
  }

  public async updateCompletedPhase(
    data: Pick<Phase, 'completed' | '_id'>
  ): Promise<Phase> {
    return this.phaseModel.findOneAndUpdate(
      { _id: data._id },
      { completed: data.completed },
      { new: true }
    );
  }
}
