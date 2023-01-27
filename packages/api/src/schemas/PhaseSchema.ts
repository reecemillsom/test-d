import { ObjectType, Field, ID } from 'type-graphql';
import { TaskSchema } from './TaskSchema';
import { phase as constants } from '../constants';

@ObjectType({ description: constants.SCHEMA_DESCRIPTION })
export class PhaseSchema {
  @Field(() => ID, { description: constants.ID_DESCRIPTION })
  _id: string;

  @Field({ description: constants.NAME_DESCRIPTION })
  name: string;

  @Field(() => [TaskSchema], { description: constants.TASKS_DESCRIPTION })
  tasks: TaskSchema[];

  @Field({ description: constants.COMPLETED_DESCRIPTION })
  completed: boolean;
}
