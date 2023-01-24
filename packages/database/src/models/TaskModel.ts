import { model } from 'mongoose';
import { TaskSchema } from '../schemas';

export const TaskModel = model('Task', TaskSchema);
