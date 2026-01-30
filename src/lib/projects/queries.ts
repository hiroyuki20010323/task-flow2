/**
 * プロジェクト取得関数
 * APIエンドポイントからプロジェクトデータを取得します
 */

import type {
  Project,
  ProjectMember,
  ProjectResponse,
  ProjectsResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

<｜tool▁call▁end｜><｜tool▁call▁begin｜>
read_file

/**
 * 全プロジェクト一覧を取得
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data: ProjectsResponse = await response.json();
    return data.projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

/**
 * プロジェクトIDでプロジェクトを取得
 */
export async function getProjectById(id: string): Promise<Project> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Project not found');
      }
      throw new Error(`Failed to fetch project: ${response.statusText}`);
    }

    const data: ProjectResponse = await response.json();
    return data.project;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

/**
 * プロジェクトメンバー一覧を取得
 */
export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/members`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch project members: ${response.statusText}`);
    }

    const data = await response.json();
    return data.members || [];
  } catch (error) {
    console.error('Error fetching project members:', error);
    throw error;
  }
}
