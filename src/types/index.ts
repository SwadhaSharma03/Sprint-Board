export interface User {
  id: string;
  username: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
