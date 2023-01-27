import { Service } from 'typedi';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { PhaseService } from 'database';
import { PhaseSchema } from '../schemas';
import { query, mutation } from '../constants';
import {
  CreatePhaseInput,
  CreateTaskInput,
  UpdateTaskCompletedInput,
} from './inputTypes';

@Service()
@Resolver()
export class PhaseResolver {
  constructor(private readonly phaseService: PhaseService) {}
  @Query(() => PhaseSchema, { description: query.getPhase.GET_DESCRIPTION })
  async getPhase(
    @Arg('id', { description: query.getPhase.ID_DESCRIPTION }) id: string
  ) {
    return this.phaseService.get(id);
  }

  @Query(() => [PhaseSchema], {
    description: query.getPhases.LIST_DESCRIPTION,
  })
  async getPhases() {
    return this.phaseService.list();
  }

  @Mutation(() => PhaseSchema, {
    description: mutation.createPhase.CREATE_DESCRIPTION,
  })
  async createPhase(@Arg('data') newPhaseData: CreatePhaseInput) {
    return this.phaseService.create(newPhaseData);
  }

  @Mutation(() => PhaseSchema, {
    description: mutation.createTask.CREATE_DESCRIPTION,
  })
  async createTask(@Arg('data') newTaskData: CreateTaskInput) {
    const { phaseId, ...rest } = newTaskData;
    return this.phaseService.createTask(phaseId, rest);
  }

  @Mutation(() => PhaseSchema, {
    description: mutation.updateTaskCompletedStatus.UPDATE_DESCRIPTION,
  })
  async updateTaskCompletedStatus(
    @Arg('data') updateTaskCompletedData: UpdateTaskCompletedInput
  ) {
    return this.phaseService.updateTaskCompletion(updateTaskCompletedData);
  }
}
