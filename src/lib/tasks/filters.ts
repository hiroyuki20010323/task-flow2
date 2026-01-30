import type { Task, TaskStatus, TaskPriority, SortParams } from '@/types';

/**
 * タスクをフィルタリング
 */
export function filterTasks(
  tasks: Task[],
  filters: {
    status?: TaskStatus;
    priority?: TaskPriority;
    projectId?: string;
    search?: string;
  }
): Task[] {
  return tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) {
      return false;
    }
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }
    if (filters.projectId && task.projectId !== filters.projectId) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(searchLower);
      const matchesDescription =
        task.description?.toLowerCase().includes(searchLower) ?? false;
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }
    return true;
  });
}

/**
 * タスクをソート
 */
export function sortTasks(
  tasks: Task[],
  sortParams?: SortParams
): Task[] {
  if (!sortParams?.field) {
    return tasks;
  }

  const sorted = [...tasks];
  const { field, order = 'asc' } = sortParams;

  sorted.sort((a, b) => {
    let aValue: string | number | null;
    let bValue: string | number | null;

    switch (field) {
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'priority':
        const priorityOrder: Record<TaskPriority, number> = {
          low: 1,
          medium: 2,
          high: 3,
          urgent: 4,
        };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  return sorted;
}
