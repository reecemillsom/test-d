import mongoose from 'mongoose';
const AutoIncrements = require('mongoose-sequence')(mongoose);
import { Phase } from 'types';
import { TaskSchema } from './TaskSchema';

const { Schema } = mongoose;

const PhaseSchema = new Schema<Phase>({
  name: { type: String, required: true },
  phaseNo: { type: Number, required: true, default: 1 },
  tasks: { type: [TaskSchema], default: [] },
  completed: { type: Boolean, default: false },
});

PhaseSchema.plugin(AutoIncrements, { inc_field: 'phaseNo' });

export { PhaseSchema };
