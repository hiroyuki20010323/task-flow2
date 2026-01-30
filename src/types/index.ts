// 基本型定義

export type UserRole = 'ADMIN' | 'MEMBER';
export type ProjectRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// エンティティ型
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

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
  project?: Project;
  user?: User;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId: string | null;
  creatorId: string;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  project?: Project;
  assignee?: User | null;
  creator?: User;
}

// リクエスト/レスポンス型
export interface CreateProjectData {
  name: string;
  description?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
}

export interface AddMemberData {
  userId: string;
  role: ProjectRole;
}

export interface UpdateMemberRoleData {
  role: ProjectRole;
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

// APIレスポンス型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// 特定のレスポンス型
export type ProjectResponse = ApiResponse<Project>;
export type ProjectsResponse = ApiResponse<PaginatedResponse<Project>>;
export type TaskResponse = ApiResponse<Task>;
export type TasksResponse = ApiResponse<PaginatedResponse<Task>>;
