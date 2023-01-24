import { model } from 'mongoose';
import { PhaseSchema } from '../schemas';

export const PhaseModel = model('Phase', PhaseSchema);
