'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProjectById, getProjectMembers } from '@/lib/projects/queries';
import {
  addProjectMember,
  updateMemberRole,
  removeProjectMember,
} from '@/lib/projects/members';
import type {
  Project,
  ProjectMember,
  AddMemberData,
  UpdateMemberRoleData,
  ProjectRole,
} from '@/types';

export default function ProjectMembersPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState<AddMemberData>({
    user_id: '',
    role: 'member',
  });
  const [addFormErrors, setAddFormErrors] = useState<Partial<Record<keyof AddMemberData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const loadData = async () => {
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
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const validateAddForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddMemberData, string>> = {};

    if (!addFormData.user_id.trim()) {
      newErrors.user_id = 'ユーザーIDは必須です';
    }

    setAddFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAddForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await addProjectMember(projectId, {
        user_id: addFormData.user_id.trim(),
        role: addFormData.role,
      });
      setAddFormData({ user_id: '', role: 'member' });
      setShowAddForm(false);
      await loadData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'メンバーの追加に失敗しました'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: ProjectRole) => {
    try {
      await updateMemberRole(projectId, userId, { role: newRole });
      await loadData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'ロールの更新に失敗しました'
      );
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('このメンバーを削除してもよろしいですか？')) {
      return;
    }

    try {
      await removeProjectMember(projectId, userId);
      await loadData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'メンバーの削除に失敗しました'
      );
    }
  };

  const getRoleLabel = (role: ProjectRole) => {
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
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            href={`/projects/${projectId}`}
            className="mb-4 inline-flex items-center text-gray-600 hover:text-foreground dark:text-gray-400"
          >
            ← プロジェクト詳細に戻る
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
                メンバー管理
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {project.name}
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="rounded-lg bg-foreground px-6 py-3 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              {showAddForm ? 'キャンセル' : 'メンバー追加'}
            </button>
          </div>
        </div>

        {/* メンバー追加フォーム */}
        {showAddForm && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
              メンバーを追加
            </h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label
                  htmlFor="user_id"
                  className="block text-sm font-medium text-black dark:text-zinc-50"
                >
                  ユーザーID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="user_id"
                  name="user_id"
                  value={addFormData.user_id}
                  onChange={(e) => {
                    setAddFormData((prev) => ({ ...prev, user_id: e.target.value }));
                    if (addFormErrors.user_id) {
                      setAddFormErrors((prev) => ({ ...prev, user_id: undefined }));
                    }
                  }}
                  className={`mt-1 block w-full rounded-lg border px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-foreground dark:bg-gray-700 dark:text-zinc-50 ${
                    addFormErrors.user_id
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="ユーザーIDを入力"
                />
                {addFormErrors.user_id && (
                  <p className="mt-1 text-sm text-red-500">{addFormErrors.user_id}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-black dark:text-zinc-50"
                >
                  ロール
                </label>
                <select
                  id="role"
                  name="role"
                  value={addFormData.role}
                  onChange={(e) =>
                    setAddFormData((prev) => ({
                      ...prev,
                      role: e.target.value as ProjectRole,
                    }))
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-foreground dark:border-gray-600 dark:bg-gray-700 dark:text-zinc-50"
                >
                  <option value="member">メンバー</option>
                  <option value="admin">管理者</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setAddFormData({ user_id: '', role: 'member' });
                    setAddFormErrors({});
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-foreground px-6 py-2 text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
                >
                  {submitting ? '追加中...' : '追加'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* メンバー一覧 */}
        <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
          <div className="border-b border-gray-200 p-6 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
              メンバー一覧 ({members.length})
            </h2>
          </div>
          {members.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">メンバーがいません</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {members.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between p-6"
                >
                  <div className="flex-1">
                    <p className="font-medium text-black dark:text-zinc-50">
                      {member.user?.name || member.user?.email || 'Unknown'}
                    </p>
                    {member.user?.email && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {member.user.email}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      value={member.role}
                      onChange={(e) =>
                        handleUpdateRole(member.user_id, e.target.value as ProjectRole)
                      }
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-black focus:outline-none focus:ring-2 focus:ring-foreground dark:border-gray-600 dark:bg-gray-700 dark:text-zinc-50"
                    >
                      <option value="owner">オーナー</option>
                      <option value="admin">管理者</option>
                      <option value="member">メンバー</option>
                    </select>
                    <button
                      onClick={() => handleRemoveMember(member.user_id)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
