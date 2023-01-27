import { Field, InputType } from 'type-graphql';
import { PhaseSchema } from '../../schemas';
import { Phase } from '../../constants';

@InputType({ description: Phase.mutation.createPhase.INPUT_TYPE_DESCRIPTION })
export class CreatePhaseInput implements Partial<PhaseSchema> {
  @Field()
  name: string;
}
