import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError, NotFoundError, ForbiddenError } from '@/lib/api/errors';
import { validateCreateTask } from '@/lib/api/validation';
import type { ApiResponse, TasksResponse, PaginatedResponse, Task } from '@/types';

// GET /api/tasks - タスク一覧取得
export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const skip = (page - 1) * pageSize;
    const status = searchParams.get('status');
    const assigneeId = searchParams.get('assigneeId');
    const projectId = searchParams.get('projectId');

    // ユーザーがアクセス可能なプロジェクトのタスクのみ取得
    const where: any = {
      project: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
    };

    if (status) {
      where.status = status;
    }

    if (assigneeId) {
      where.assigneeId = assigneeId;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          assignee: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          },
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: pageSize,
      }),
      prisma.task.count({ where }),
    ]);

    const response: TasksResponse = {
      success: true,
      data: {
        items: tasks as Task[],
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/tasks - タスク作成
export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAuth();
    const body = await request.json();
    const data = validateCreateTask(body);

    // プロジェクトの存在確認とアクセス権限チェック
    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId,
                role: {
                  in: ['OWNER', 'ADMIN', 'MEMBER'],
                },
              },
            },
          },
        ],
      },
    });

    if (!project) {
      throw new NotFoundError('プロジェクト');
    }

    // アサイン先ユーザーの存在確認（指定されている場合）
    if (data.assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: data.assigneeId },
      });

      if (!assignee) {
        throw new NotFoundError('アサイン先ユーザー');
      }

      // アサイン先ユーザーがプロジェクトメンバーかチェック
      const isMember = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: data.projectId,
            userId: data.assigneeId,
          },
        },
      });

      if (!isMember && project.ownerId !== data.assigneeId) {
        throw new ForbiddenError('アサイン先ユーザーはプロジェクトのメンバーではありません');
      }
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        priority: data.priority || 'MEDIUM',
        projectId: data.projectId,
        assigneeId: data.assigneeId || null,
        creatorId: userId,
        dueDate: data.dueDate || null,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
        creator: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const response: ApiResponse<Task> = {
      success: true,
      data: task as Task,
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
