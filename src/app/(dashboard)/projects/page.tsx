'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProjects } from '@/lib/projects/queries';
import type { Project, ProjectStatus } from '@/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery, statusFilter]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プロジェクトの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // 検索フィルタ
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query)
      );
    }

    // ステータスフィルタ
    if (statusFilter !== 'all') {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const getStatusBadgeColor = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <button
            onClick={loadProjects}
            className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
              プロジェクト一覧
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {filteredProjects.length}件のプロジェクト
            </p>
          </div>
          <Link
            href="/projects/new"
            className="rounded-lg bg-foreground px-6 py-3 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            新規プロジェクト
          </Link>
        </div>

        {/* フィルターと検索 */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* 検索バー */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="プロジェクト名または説明で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black focus:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground dark:border-gray-600 dark:bg-gray-800 dark:text-zinc-50"
            />
          </div>

          {/* ステータスフィルター */}
          <div className="flex gap-2">
            {(['all', 'active', 'completed', 'on_hold', 'archived'] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-foreground text-background'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {status === 'all' ? 'すべて' : getStatusLabel(status)}
                </button>
              )
            )}
          </div>
        </div>

        {/* プロジェクト一覧 */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center dark:bg-gray-800">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {searchQuery || statusFilter !== 'all'
                ? '条件に一致するプロジェクトが見つかりません'
                : 'プロジェクトがありません'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link
                href="/projects/new"
                className="mt-4 inline-block rounded-lg bg-foreground px-6 py-3 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                最初のプロジェクトを作成
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-black group-hover:text-foreground dark:text-zinc-50">
                    {project.name}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeColor(
                      project.status
                    )}`}
                  >
                    {getStatusLabel(project.status)}
                  </span>
                </div>
                {project.description && (
                  <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-400">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                  <span>
                    {new Date(project.created_at).toLocaleDateString('ja-JP')}
                  </span>
                  <span className="group-hover:text-foreground">
                    詳細 →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
