import { Model } from 'mongoose';
import { Phase } from 'types';

export class PhaseRepo {
  constructor(private phaseModel: Model<Phase>) {}

  public async create(data: Pick<Phase, 'name'>): Phase {
    return this.phaseModel.create(data);
  }

  public async updateCompleted(data: Pick<Phase, 'completed' | '_id'>): Phase {
    return this.phaseModel.findOneAndUpdate(
      { _id: data._id },
      { completed: data.completed },
      { new: true }
    );
  }
}
