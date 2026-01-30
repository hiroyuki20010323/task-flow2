import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError, NotFoundError } from '@/lib/api/errors';
import type { ApiResponse, TasksResponse, PaginatedResponse, Task } from '@/types';

// GET /api/projects/[id]/tasks - プロジェクト別タスク一覧取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const skip = (page - 1) * pageSize;
    const status = searchParams.get('status');
    const assigneeId = searchParams.get('assigneeId');

    // プロジェクトの存在確認とアクセス権限チェック
    const project = await prisma.project.findFirst({
      where: {
        id,
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
    });

    if (!project) {
      throw new NotFoundError('プロジェクト');
    }

    const where: any = {
      projectId: id,
    };

    if (status) {
      where.status = status;
    }

    if (assigneeId) {
      where.assigneeId = assigneeId;
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
