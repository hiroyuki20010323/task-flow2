/**
 * メンバー管理関数
 * プロジェクトメンバーの追加・削除・ロール変更を実行します
 */

import type {
  ProjectMember,
  AddMemberData,
  UpdateMemberRoleData,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * プロジェクトにメンバーを追加
 */
export async function addProjectMember(
  projectId: string,
  data: AddMemberData
): Promise<ProjectMember> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to add member: ${response.statusText}`
      );
    }

    const result = await response.json();
    return result.member;
  } catch (error) {
    console.error('Error adding project member:', error);
    throw error;
  }
}

/**
 * プロジェクトメンバーのロールを更新
 */
export async function updateMemberRole(
  projectId: string,
  userId: string,
  data: UpdateMemberRoleData
): Promise<ProjectMember> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/members/${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update member role: ${response.statusText}`
      );
    }

    const result = await response.json();
    return result.member;
  } catch (error) {
    console.error('Error updating member role:', error);
    throw error;
  }
}

/**
 * プロジェクトからメンバーを削除
 */
export async function removeProjectMember(
  projectId: string,
  userId: string
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/members/${userId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to remove member: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error('Error removing project member:', error);
    throw error;
  }
}
