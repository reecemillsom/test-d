import { Field, ID, InputType } from 'type-graphql';
import { TaskSchema } from '../../schemas';
import { createTaskInput as constants } from '../../constants';

@InputType({ description: constants.INPUT_TYPE_DESCRIPTION })
export class CreateTaskInput implements Partial<TaskSchema> {
  @Field(() => ID, { description: constants.ID_DESCRIPTION })
  phaseId: string;

  @Field({ description: constants.NAME_DESCRIPTION })
  name: string;
}
