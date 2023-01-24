import mongoose from 'mongoose';
import { Task } from 'types';

const { Schema } = mongoose;

const TaskSchema = new Schema<Task>({
  completed: { type: Boolean, default: false },
});

export { TaskSchema };
