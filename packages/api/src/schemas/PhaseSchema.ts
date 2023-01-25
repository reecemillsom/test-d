import { ObjectType, Field, ID } from 'type-graphql';
import { TaskSchema } from './TaskSchema';
import { Phase } from '../constants';

// TODO I wonder if this can implement the Phase interface I created in the types package.
@ObjectType({ description: Phase.schema.SCHEMA_DESCRIPTION })
export class PhaseSchema {
  @Field(() => ID, { description: Phase.schema.ID_DESCRIPTION })
  _id: string;

  @Field({ description: Phase.schema.NAME_DESCRIPTION })
  name: string;

  @Field(() => [TaskSchema], { description: Phase.schema.TASKS_DESCRIPTION })
  tasks: TaskSchema[];

  @Field({ description: Phase.schema.COMPLETED_DESCRIPTION })
  completed: boolean;
}
