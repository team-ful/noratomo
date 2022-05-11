import {objectType, extendType} from 'nexus';

export const Task = objectType({
  name: 'Task',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('title');
    t.nonNull.boolean('done');
  },
});

export const TasksQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('tasks', {
      type: 'Task',
      resolve: () => {
        return [
          {
            id: 1,
            title: 'sample task 1',
            done: true,
          },
          {
            id: 2,
            title: 'sample task 2',
            done: true,
          },
          {
            id: 3,
            title: 'sample task 3',
            done: false,
          },
        ];
      },
    });
  },
});
