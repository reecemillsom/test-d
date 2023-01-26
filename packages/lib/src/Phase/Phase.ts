import { Task } from '../Task/Task';

export interface Phase {
  _id: string;
  name: string;
  phaseNo: number;
  tasks: Task[];
  completed: boolean;
}
