import type {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskResponse,
} from '@/types';

/**
 * タスクを作成
 */
export async function createTask(data: CreateTaskData): Promise<TaskResponse> {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'タスクの作成に失敗しました' }));
    throw new Error(error.message || 'タスクの作成に失敗しました');
  }

  return response.json();
}

/**
 * タスクを更新
 */
export async function updateTask(
  id: string,
  data: UpdateTaskData
): Promise<TaskResponse> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'タスクの更新に失敗しました' }));
    throw new Error(error.message || 'タスクの更新に失敗しました');
  }

  return response.json();
}

/**
 * タスクを削除
 */
export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('タスクの削除に失敗しました');
  }
}
