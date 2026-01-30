// ============================================
// TaskFlow 共有型定義ファイル
// ============================================
// このファイルは全エージェントが参照する共有型定義です。
// 編集する場合は、他のエージェントとの整合性を確認してください。

// ============================================
// 認証関連の型定義
// ============================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: User;
  expires: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  error?: string;
}

// ============================================
// プロジェクト関連の型定義
// ============================================

export type ProjectStatus = 'active' | 'archived' | 'completed';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  members?: ProjectMember[];
  tasks?: Task[];
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  createdAt: Date;
  user?: User;
}

export type ProjectRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface CreateProjectData {
  name: string;
  description?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface AddMemberData {
  userId: string;
  role: ProjectRole;
}

export interface UpdateMemberRoleData {
  role: ProjectRole;
}

export interface ProjectResponse {
  success: boolean;
  data?: Project;
  error?: string;
}

export interface ProjectsResponse {
  success: boolean;
  data?: Project[];
  error?: string;
}

// ============================================
// タスク関連の型定義
// ============================================

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId: string | null;
  createdById: string;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  project?: Project;
  assignee?: User;
  creator?: User;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  projectId: string;
  assigneeId?: string;
  dueDate?: Date;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: Date | null;
}

export interface TaskResponse {
  success: boolean;
  data?: Task;
  error?: string;
}

export interface TasksResponse {
  success: boolean;
  data?: Task[];
  error?: string;
}

// ============================================
// API関連の型定義
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
}

// ============================================
// 共通の型定義
// ============================================

export interface SelectOption {
  value: string;
  label: string;
}

export type SortOrder = 'asc' | 'desc';

export interface SortParams {
  field: string;
  order: SortOrder;
}
