import type { TaskPriority } from '@/types';

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

const priorityConfig: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  low: {
    label: '低',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  },
  medium: {
    label: '中',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  high: {
    label: '高',
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  },
  urgent: {
    label: '緊急',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
};

export function TaskPriorityBadge({
  priority,
  className = '',
}: TaskPriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}
