import { Service } from 'typedi';
import { Phase } from 'lib';
import { every } from 'lodash';
import { PhaseRepo } from '../repos/PhaseRepo';

@Service()
export default class PhaseService {
  constructor(private phaseRepo: PhaseRepo) {}

  public async updateTaskCompletion(data: {
    phaseId: string;
    taskId: string;
    completed: boolean;
  }): Promise<Phase> {
    const { phaseId, taskId, ...completed } = data;
    const phase = await this.phaseRepo.get(phaseId);
    const previousPhase = await this.phaseRepo.find({
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
