import { ObjectType, Field, ID } from 'type-graphql';
import { Task } from '../constants';

@ObjectType({ description: Task.schema.SCHEMA_DEFINITION })
export class TaskSchema {
  @Field(() => ID, { description: Task.schema.ID_DEFINITION })
  _id: string;

  @Field({ description: Task.schema.NAME_DESCRIPTION })
  name: string;

  @Field({ description: Task.schema.COMPLETED_DESCRIPTION })
  completed: boolean;
}
