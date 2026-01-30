/**
 * プロジェクト作成・更新・削除関数
 * APIエンドポイントに対してプロジェクトの変更操作を実行します
 */

import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
  ProjectResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * 新規プロジェクトを作成
 */
export async function createProject(
  data: CreateProjectData
): Promise<Project> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
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
        errorData.message || `Failed to create project: ${response.statusText}`
      );
    }

    const result: ProjectResponse = await response.json();
    return result.project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

/**
 * プロジェクトを更新
 */
export async function updateProject(
  id: string,
  data: UpdateProjectData
): Promise<Project> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update project: ${response.statusText}`
      );
    }

    const result: ProjectResponse = await response.json();
    return result.project;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

/**
 * プロジェクトを削除
 */
export async function deleteProject(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to delete project: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}
