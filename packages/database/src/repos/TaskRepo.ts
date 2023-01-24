import { Model } from 'mongoose';
import { Task } from 'types';

export class TaskRepo {
  constructor(private taskModel: Model<Task>) {}

  public async create(data: Pick<Task, 'name'>): Task {
    return this.taskModel.create(data);
  }

  public updateCompleted(data: Pick<Task, '_id' | 'completed'>): Task {
    return this.taskModel.findOneAndUpdate(
      { _id: data._id },
      { completed: data.completed },
      { new: true }
    );
  }
}
