import { Field, InputType } from 'type-graphql';
import { PhaseSchema } from '../../schemas';
import { createPhaseInput as constants } from '../../constants';

@InputType({ description: constants.INPUT_TYPE_DESCRIPTION })
export class CreatePhaseInput implements Partial<PhaseSchema> {
  @Field({ description: constants.NAME_DESCRIPTION })
  name: string;
}
