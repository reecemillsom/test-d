import { Field, InputType } from 'type-graphql';
import { PhaseSchema } from '../../schemas';
import { Phase } from '../../constants';

@InputType({ description: Phase.mutation.createPhase.INPUT_TYPE_DESCRIPTION })
export class CreatePhase implements Partial<PhaseSchema> {
  @Field({ description: Phase.mutation.createPhase.NAME_DESCRIPTION })
  name: string;
}
