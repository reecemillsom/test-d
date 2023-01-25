import { Field, ID, InputType } from 'type-graphql';
import { TaskSchema } from '../../schemas';
import { Phase } from '../../constants';

@InputType({ description: Phase.mutation.createTask.INPUT_TYPE_DESCRIPTION })
export class CreateTask implements Partial<TaskSchema> {
  @Field(() => ID, { description: Phase.mutation.createTask.ID_DESCRIPTION })
  phaseId: string;

  @Field({ description: Phase.mutation.createTask.NAME_DESCRIPTION })
  name: string;
}
