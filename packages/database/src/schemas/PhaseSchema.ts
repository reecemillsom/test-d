import mongoose from 'mongoose';
import { Phase } from 'types';

const { Schema } = mongoose;

const PhaseSchema = new Schema<Phase>({
  name: { type: String, required: true },
  phaseNo: { type: Number, required: true },
  tasks: { type: [mongoose.Types.ObjectId], default: [] },
  completed: { type: Boolean, default: false },
});

export { PhaseSchema };
