import { Model } from 'mongoose';
import { Service } from 'typedi';
import { Phase, Task } from 'lib';
import { PhaseModel } from '../models';

@Service()
export class PhaseRepo {
  public phaseModel: Model<Phase>;
  constructor() {
    this.phaseModel = PhaseModel;
  }

  public async get(phaseId: string): Promise<Phase> {
    return this.phaseModel.findById(phaseId);
  }

  public async list(): Promise<Phase[]> {
    return this.phaseModel.find();
  }

  public async findOne(filter: Partial<Omit<Phase, '_id'>>): Promise<Phase> {
    return this.phaseModel.findOne(filter);
  }

  public async findMany(filter): Promise<Phase[]> {
    return this.phaseModel.find(filter);
  }

  public async create(data: Pick<Phase, 'name'>): Promise<Phase> {
    return this.phaseModel.create(data);
  }

  public async createTask(phaseId: string, data: Pick<Task, 'name'>) {
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
  ): Promise<Phase> {
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

  public async updatePhaseCompletion(
    data: Pick<Phase, 'completed' | '_id'>
  ): Promise<Phase> {
    return this.phaseModel.findOneAndUpdate(
      { _id: data._id },
      { completed: data.completed },
      { new: true }
    );
  }

  public async updatePhaseAndTasksCompletedFalse(
    phaseIds: string[]
  ): Promise<void> {
    await this.phaseModel.updateMany(
      { _id: { $in: phaseIds } },
      {
        $set: {
          completed: false,
          'tasks.$[].completed': false,
        },
      }
    );
  }
}
