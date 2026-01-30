import type {
  Task,
  TaskResponse,
  TasksResponse,
  SortParams,
  PaginationParams,
} from '@/types';

/**
 * タスク一覧を取得
 */
export async function getTasks(
  params?: {
    status?: string;
    priority?: string;
    projectId?: string;
    search?: string;
  } & SortParams &
    PaginationParams
): Promise<TasksResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.status) searchParams.append('status', params.status);
  if (params?.priority) searchParams.append('priority', params.priority);
  if (params?.projectId) searchParams.append('projectId', params.projectId);
  if (params?.search) searchParams.append('search', params.search);
  if (params?.field) searchParams.append('field', params.field);
  if (params?.order) searchParams.append('order', params.order);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const response = await fetch(`/api/tasks?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('タスクの取得に失敗しました');
  }

  return response.json();
}

/**
 * タスク詳細を取得
 */
export async function getTask(id: string): Promise<TaskResponse> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('タスクが見つかりません');
    }
    throw new Error('タスクの取得に失敗しました');
  }

  return response.json();
}
