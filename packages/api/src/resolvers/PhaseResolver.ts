import { Arg, Query, Resolver } from 'type-graphql';
import { PhaseSchema } from '../schemas';

@Resolver()
export class PhaseResolver {
  constructor() {}
  @Query((returns) => PhaseSchema)
  async getPhase(@Arg('id', { description: '' }) id: string): Promise<void> {}

  @Query((returns) => [PhaseSchema])
  async getPhases() {}
}
