'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProject } from '@/lib/projects/mutations';
import type { CreateProjectData } from '@/types';

export default function NewProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateProjectData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateProjectData, string>> = {};

    if (!formData.name.trim()) {
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
      const project = await createProject({
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
      });
      router.push(`/projects/${project.id}`);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'プロジェクトの作成に失敗しました'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // エラーをクリア
    if (errors[name as keyof CreateProjectData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="mb-4 inline-flex items-center text-gray-600 hover:text-foreground dark:text-gray-400"
          >
            ← プロジェクト一覧に戻る
          </Link>
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
            新規プロジェクト作成
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
                  {formData.description.length}/1000
                </p>
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="mt-8 flex justify-end gap-4">
            <Link
              href="/projects"
              className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-foreground px-6 py-2 text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
            >
              {submitting ? '作成中...' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
