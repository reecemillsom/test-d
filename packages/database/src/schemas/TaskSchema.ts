import mongoose from 'mongoose';
import { Task } from 'lib';

const { Schema } = mongoose;

const TaskSchema = new Schema<Task>({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

export { TaskSchema };
