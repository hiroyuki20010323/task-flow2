// ============================================
// TaskFlow 共有型定義ファイル
// ============================================
// このファイルは全エージェントが参照する共有型定義です。
// 編集する場合は、他のエージェントとの整合性を確認してください。

// ============================================
// 基本型定義
// ============================================

export type UserRole = 'ADMIN' | 'MEMBER';
export type ProjectRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// 互換性のための型エイリアス（小文字版）
export type ProjectStatus = 'active' | 'archived' | 'completed';
export type TaskStatusLower = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriorityLower = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectRoleLower = 'owner' | 'admin' | 'member' | 'viewer';

// ============================================
// 認証関連の型定義
// ============================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
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

export interface Project {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner?: User;
  members?: ProjectMember[];
  tasks?: Task[];
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  joinedAt: Date;
  createdAt?: Date; // 互換性のため
  project?: Project;
  user?: User;
}

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

// ============================================
// タスク関連の型定義
// ============================================

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId: string | null;
  creatorId: string;
  createdById?: string; // 互換性のため
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  project?: Project;
  assignee?: User | null;
  creator?: User;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: string | Date | null;
  projectId: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: string | Date | null;
}

// ============================================
// API関連の型定義
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError | string;
  message?: string;
}

export interface ApiError {
  code?: string;
  message: string;
  details?: unknown;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items?: T[];
  data?: T[]; // 互換性のため
  total: number;
  page: number;
  pageSize?: number;
  limit?: number; // 互換性のため
  totalPages: number;
  pagination?: { // 互換性のため
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 特定のレスポンス型
export type ProjectResponse = ApiResponse<Project>;
export type ProjectsResponse = ApiResponse<PaginatedResponse<Project> | Project[]>;
export type TaskResponse = ApiResponse<Task>;
export type TasksResponse = ApiResponse<PaginatedResponse<Task> | Task[]>;

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
