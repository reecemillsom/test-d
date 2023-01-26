import { Service } from 'typedi';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { PhaseRepo } from 'database';
import { PhaseSchema } from '../schemas';
import { Phase } from '../constants';
import { CreatePhase, CreateTask } from './inputTypes';

@Service()
@Resolver()
export class PhaseResolver {
  constructor(private readonly phaseRepo: PhaseRepo) {}
  @Query(() => PhaseSchema, { description: Phase.query.GET_DESCRIPTION })
  async getPhase(
    @Arg('id', { description: Phase.query.ID_DESCRIPTION }) id: string
  ) {
    return this.phaseRepo.get(id);
  }

  @Query((returns) => [PhaseSchema], {
    description: Phase.query.LIST_DESCRIPTION,
  })
  async getPhases() {
    return this.phaseRepo.list();
  }

  @Mutation(() => PhaseSchema, {
    description: Phase.mutation.createPhase.CREATE_DESCRIPTION,
  })
  async createPhase(@Arg('data') newPhaseData: CreatePhase) {
    return await this.phaseRepo.create(newPhaseData);
  }

  @Mutation(() => PhaseSchema, {
    description: Phase.mutation.createTask.CREATE_DESCRIPTION,
  })
  async createTask(@Arg('data') newTaskData: CreateTask) {
    const { phaseId, ...rest } = newTaskData;
    return this.phaseRepo.createTask(phaseId, rest);
  }
}
