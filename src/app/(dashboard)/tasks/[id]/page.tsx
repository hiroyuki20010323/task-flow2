'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTask } from '@/lib/tasks/queries';
import { updateTask, deleteTask } from '@/lib/tasks/mutations';
import type { Task, TaskStatus, TaskPriority } from '@/types';
import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge';
import { TaskPriorityBadge } from '@/components/tasks/TaskPriorityBadge';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTask(id);
      setTask(response.task);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'タスクの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task) return;

    try {
      setUpdating(true);
      await updateTask(task.id, { status: newStatus });
      await loadTask();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ステータスの更新に失敗しました');
    } finally {
      setUpdating(false);
    }
  };

  const handlePriorityChange = async (newPriority: TaskPriority) => {
    if (!task) return;

    try {
      setUpdating(true);
      await updateTask(task.id, { priority: newPriority });
      await loadTask();
    } catch (err) {
      setError(err instanceof Error ? err.message : '優先度の更新に失敗しました');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    if (!confirm('このタスクを削除しますか？')) {
      return;
    }

    try {
      setDeleting(true);
      await deleteTask(task.id);
      router.push('/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'タスクの削除に失敗しました');
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600 dark:text-gray-400">
          読み込み中...
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
        <Link
          href="/tasks"
          className="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400"
        >
          タスク一覧に戻る
        </Link>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/tasks"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          ← タスク一覧に戻る
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/tasks/${task.id}/edit`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            編集
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
          >
            {deleting ? '削除中...' : '削除'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
          {task.title}
        </h1>

        <div className="mb-6 flex items-center gap-4">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
        </div>

        {task.description && (
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              説明
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              ステータス
            </h3>
            <div className="flex flex-wrap gap-2">
              {(['todo', 'in_progress', 'done', 'cancelled'] as TaskStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updating || task.status === status}
                    className={`rounded-lg px-3 py-1 text-sm transition-colors ${
                      task.status === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    } disabled:opacity-50`}
                  >
                    {status === 'todo' && '未着手'}
                    {status === 'in_progress' && '進行中'}
                    {status === 'done' && '完了'}
                    {status === 'cancelled' && 'キャンセル'}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              優先度
            </h3>
            <div className="flex flex-wrap gap-2">
              {(['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map(
                (priority) => (
                  <button
                    key={priority}
                    onClick={() => handlePriorityChange(priority)}
                    disabled={updating || task.priority === priority}
                    className={`rounded-lg px-3 py-1 text-sm transition-colors ${
                      task.priority === priority
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    } disabled:opacity-50`}
                  >
                    {priority === 'low' && '低'}
                    {priority === 'medium' && '中'}
                    {priority === 'high' && '高'}
                    {priority === 'urgent' && '緊急'}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {task.dueDate && (
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                期限
              </h3>
              <p className="text-gray-900 dark:text-gray-100">
                {formatDate(task.dueDate)}
              </p>
            </div>
          )}
          <div>
            <h3 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              作成日
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              {formatDate(task.createdAt)}
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              更新日
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              {formatDate(task.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
