import { Service } from 'typedi';
import { Arg, Query, Resolver } from 'type-graphql';
import { PhaseRepo } from 'database';
import { PhaseSchema } from '../schemas';
import { Phase } from '../constants';

@Service()
@Resolver()
export class PhaseResolver {
  constructor(private readonly phaseRepo: PhaseRepo) {}
  @Query((returns) => PhaseSchema, { description: Phase.query.GET_DESCRIPTION })
  async getPhase(
    @Arg('id', { description: Phase.query.ID_DESCRIPTION }) id: string
  ): Promise<void> {
    return this.phaseRepo.get(id);
  }

  @Query((returns) => [PhaseSchema], {
    description: Phase.query.LIST_DESCRIPTION,
  })
  async getPhases() {
    return this.phaseRepo.list();
  }
}
