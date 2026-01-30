'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProjectById } from '@/lib/projects/queries';
import { updateProject } from '@/lib/projects/mutations';
import type { Project, UpdateProjectData, ProjectStatus } from '@/types';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<UpdateProjectData>({
    name: '',
    description: '',
    status: 'active',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateProjectData, string>>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjectById(projectId);
      setProject(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        status: data.status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プロジェクトの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateProjectData, string>> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'プロジェクト名は必須です';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'プロジェクト名は100文字以内で入力してください';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = '説明は1000文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const updatedProject = await updateProject(projectId, {
        name: formData.name?.trim(),
        description: formData.description?.trim() || undefined,
        status: formData.status,
      });
      router.push(`/projects/${updatedProject.id}`);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'プロジェクトの更新に失敗しました'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // エラーをクリア
    if (errors[name as keyof UpdateProjectData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return '進行中';
      case 'completed':
        return '完了';
      case 'archived':
        return 'アーカイブ';
      case 'on_hold':
        return '保留';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">読み込み中...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-200">
            {error || 'プロジェクトが見つかりません'}
          </p>
          <Link
            href="/projects"
            className="mt-4 inline-block rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            プロジェクト一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            href={`/projects/${projectId}`}
            className="mb-4 inline-flex items-center text-gray-600 hover:text-foreground dark:text-gray-400"
          >
            ← プロジェクト詳細に戻る
          </Link>
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
            プロジェクト編集
          </h1>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="space-y-6">
            {/* プロジェクト名 */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-black dark:text-zinc-50"
              >
                プロジェクト名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-foreground dark:bg-gray-700 dark:text-zinc-50 ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="プロジェクト名を入力"
                maxLength={100}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* 説明 */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-black dark:text-zinc-50"
              >
                説明
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className={`mt-1 block w-full rounded-lg border px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-foreground dark:bg-gray-700 dark:text-zinc-50 ${
                  errors.description
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="プロジェクトの説明を入力（任意）"
                maxLength={1000}
              />
              <div className="mt-1 flex justify-between">
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
                <p className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                  {formData.description?.length || 0}/1000
                </p>
              </div>
            </div>

            {/* ステータス */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-black dark:text-zinc-50"
              >
                ステータス
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-foreground dark:border-gray-600 dark:bg-gray-700 dark:text-zinc-50"
              >
                <option value="active">進行中</option>
                <option value="completed">完了</option>
                <option value="on_hold">保留</option>
                <option value="archived">アーカイブ</option>
              </select>
            </div>
          </div>

          {/* ボタン */}
          <div className="mt-8 flex justify-end gap-4">
            <Link
              href={`/projects/${projectId}`}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-foreground px-6 py-2 text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
            >
              {submitting ? '更新中...' : '更新'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
