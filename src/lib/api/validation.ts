import { z } from 'zod';
import type {
  CreateProjectData,
  UpdateProjectData,
  AddMemberData,
  UpdateMemberRoleData,
  CreateTaskData,
  UpdateTaskData,
  ProjectRole,
  TaskPriority,
  TaskStatus,
} from '@/types';
import { BadRequestError } from './errors';

// プロジェクト関連のスキーマ
export const createProjectSchema = z.object({
  name: z.string().min(1, 'プロジェクト名は必須です').max(100, 'プロジェクト名は100文字以内で入力してください'),
  description: z.string().max(500, '説明は500文字以内で入力してください').optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

// メンバー関連のスキーマ
const projectRoleSchema = z.enum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']);

export const addMemberSchema = z.object({
  userId: z.string().min(1, 'ユーザーIDは必須です'),
  role: projectRoleSchema,
});

export const updateMemberRoleSchema = z.object({
  role: projectRoleSchema,
});

// タスク関連のスキーマ
const taskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
const taskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内で入力してください'),
  description: z.string().max(1000, '説明は1000文字以内で入力してください').optional(),
  priority: taskPrioritySchema.optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string().datetime().optional().nullable(),
  projectId: z.string().min(1, 'プロジェクトIDは必須です'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

export const updateTaskStatusSchema = z.object({
  status: taskStatusSchema,
});

// バリデーション関数
export function validateCreateProject(data: unknown): CreateProjectData {
  try {
    return createProjectSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestError('バリデーションエラー', error.errors);
    }
    throw error;
  }
}

export function validateUpdateProject(data: unknown): UpdateProjectData {
  try {
    return updateProjectSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestError('バリデーションエラー', error.errors);
    }
    throw error;
  }
}

export function validateAddMember(data: unknown): AddMemberData {
  try {
    return addMemberSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestError('バリデーションエラー', error.errors);
    }
    throw error;
  }
}

export function validateUpdateMemberRole(data: unknown): UpdateMemberRoleData {
  try {
    return updateMemberRoleSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestError('バリデーションエラー', error.errors);
    }
    throw error;
  }
}

export function validateCreateTask(data: unknown): CreateTaskData {
  try {
    const parsed = createTaskSchema.parse(data);
    return {
      ...parsed,
      dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestError('バリデーションエラー', error.errors);
    }
    throw error;
  }
}

export function validateUpdateTask(data: unknown): UpdateTaskData {
  try {
    const parsed = updateTaskSchema.parse(data);
    return {
      ...parsed,
      dueDate: parsed.dueDate !== undefined ? (parsed.dueDate ? new Date(parsed.dueDate) : null) : undefined,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestError('バリデーションエラー', error.errors);
    }
    throw error;
  }
}

export function validateUpdateTaskStatus(data: unknown): { status: TaskStatus } {
  try {
    return updateTaskStatusSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestError('バリデーションエラー', error.errors);
    }
    throw error;
  }
}
