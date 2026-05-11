import { rest } from 'msw';

const STORAGE_KEY = 'taskly_tasks';

const getTasks = () => {
  const tasks = localStorage.getItem(STORAGE_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

const saveTasks = (tasks: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const handlers = [
  // Auth
  rest.post('/api/login', (req, res, ctx) => {
    const { username } = req.body as any;

    // We now allow any login! We'll just use whatever username you typed.
    return res(
      ctx.status(200),
      ctx.json({
        token: 'fake-jwt-token',
        user: { 
          id: Date.now().toString(), 
          username: username, 
          name: username.charAt(0).toUpperCase() + username.slice(1) 
        },
      })
    );
  }),

  // Tasks
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(getTasks()));
  }),

  rest.post('/api/tasks', (req, res, ctx) => {
    const newTask = { ...req.body as any, id: Date.now().toString() };
    const tasks = getTasks();
    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    return res(ctx.status(201), ctx.json(newTask));
  }),

  rest.put('/api/tasks/:id', (req, res, ctx) => {
    const { id } = req.params;
    const updatedTask = req.body as any;
    const tasks = getTasks();
    const updatedTasks = tasks.map((t: any) => (t.id === id ? updatedTask : t));
    saveTasks(updatedTasks);
    return res(ctx.status(200), ctx.json(updatedTask));
  }),

  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    const { id } = req.params;
    const tasks = getTasks();
    const updatedTasks = tasks.filter((t: any) => t.id !== id);
    saveTasks(updatedTasks);
    return res(ctx.status(200), ctx.json({ id }));
  }),
];
