'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProjectById, getProjectMembers } from '@/lib/projects/queries';
import { deleteProject } from '@/lib/projects/mutations';
import type { Project, ProjectMember, ProjectStatus } from '@/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectData, membersData] = await Promise.all([
        getProjectById(projectId),
        getProjectMembers(projectId),
      ]);
      setProject(projectData);
      setMembers(membersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プロジェクトの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('このプロジェクトを削除してもよろしいですか？')) {
      return;
    }

    try {
      setDeleting(true);
      await deleteProject(projectId);
      router.push('/projects');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'プロジェクトの削除に失敗しました');
      setDeleting(false);
    }
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'オーナー';
      case 'admin':
        return '管理者';
      case 'member':
        return 'メンバー';
      default:
        return role;
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="mb-4 inline-flex items-center text-gray-600 hover:text-foreground dark:text-gray-400"
          >
            ← プロジェクト一覧に戻る
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
                  {project.name}
                </h1>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeColor(
                    project.status
                  )}`}
                >
                  {getStatusLabel(project.status)}
                </span>
              </div>
              {project.description && (
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                href={`/projects/${projectId}/edit`}
                className="rounded-lg bg-foreground px-4 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                編集
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? '削除中...' : '削除'}
              </button>
            </div>
          </div>
        </div>

        {/* プロジェクト情報 */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
              プロジェクト情報
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  作成日
                </dt>
                <dd className="mt-1 text-black dark:text-zinc-50">
                  {new Date(project.created_at).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
              {project.updated_at && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    更新日
                  </dt>
                  <dd className="mt-1 text-black dark:text-zinc-50">
                    {new Date(project.updated_at).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* メンバー一覧 */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                メンバー ({members.length})
              </h2>
              <Link
                href={`/projects/${projectId}/members`}
                className="text-sm text-foreground hover:underline"
              >
                管理 →
              </Link>
            </div>
            {members.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">メンバーがいません</p>
            ) : (
              <ul className="space-y-2">
                {members.slice(0, 5).map((member) => (
                  <li
                    key={member.user_id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-black dark:text-zinc-50">
                      {member.user?.name || member.user?.email || 'Unknown'}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {getRoleLabel(member.role)}
                    </span>
                  </li>
                ))}
                {members.length > 5 && (
                  <li className="text-sm text-gray-500 dark:text-gray-400">
                    他 {members.length - 5} 名...
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* タスク一覧（Agent3と連携予定） */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
            タスク
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            タスク機能はAgent3が実装予定です
          </p>
        </div>
      </div>
    </div>
  );
}
