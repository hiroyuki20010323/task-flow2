// 型定義ファイル（参照用 - 他のエージェントが実装予定）
// このファイルは編集禁止ですが、実装のために型定義を参照します

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string | null;
  assigneeId: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  projectId?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface TaskResponse {
  task: Task;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
}

export interface SortParams {
  field?: string;
  order?: 'asc' | 'desc';
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
