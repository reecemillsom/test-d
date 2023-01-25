export const Phase = {
  schema: {
    SCHEMA_DESCRIPTION: 'This is the schema definition for a phase',
    ID_DESCRIPTION: 'The unique id of this phase',
    NAME_DESCRIPTION: 'The name for this phase',
    TASKS_DESCRIPTION: 'The tasks created for the phase',
    COMPLETED_DESCRIPTION:
      'The status of whether or not this phase is completed',
  },
  query: {
    GET_DESCRIPTION: 'This will retrieve you a single phase',
    LIST_DESCRIPTION: 'This will retrieve you a list of phases',
    ID_DESCRIPTION: 'This is the id of the phase you wish to find',
  },
  mutation: {
    createPhase: {
      CREATE_DESCRIPTION: 'This will create you a phase',
      INPUT_TYPE_DESCRIPTION:
        'This describes the data you can insert for a phase',
      NAME_DESCRIPTION: 'The name that you wish to associate with the phase',
    },
    createTask: {
      CREATE_DESCRIPTION: 'This will create you a task for a phase',
      INPUT_TYPE_DESCRIPTION:
        'This describes the data you can insert for a phase',
      NAME_DESCRIPTION: 'The name that you wish to associate with the task',
      ID_DESCRIPTION: 'The id of the phase you wish to create the task for',
    },
  },
};
