import { ObjectType, Field, ID } from 'type-graphql';
import { task as constants } from '../constants';

@ObjectType({ description: constants.SCHEMA_DEFINITION })
export class TaskSchema {
  @Field(() => ID, { description: constants.ID_DEFINITION })
  _id: string;

  @Field({ description: constants.NAME_DESCRIPTION })
  name: string;

  @Field({ description: constants.COMPLETED_DESCRIPTION })
  completed: boolean;
}
