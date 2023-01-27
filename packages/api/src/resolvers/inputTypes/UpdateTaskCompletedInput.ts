import { Field, InputType } from 'type-graphql';
import { updateTaskCompletedInput as constants } from '../../constants';

@InputType({ description: constants.INPUT_TYPE_DESCRIPTION })
export class UpdateTaskCompletedInput {
  @Field({ description: constants.PHASE_ID_DESCRIPTION })
  phaseId: string;

  @Field({ description: constants.TASK_ID_DESCRIPTION })
  taskId: string;

  @Field({ description: constants.COMPLETED_DESCRIPTION })
  completed: boolean;
}
