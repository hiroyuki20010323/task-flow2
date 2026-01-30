import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError, NotFoundError } from '@/lib/api/errors';
import { validateUpdateTaskStatus } from '@/lib/api/validation';
import type { ApiResponse, Task } from '@/types';

// PATCH /api/tasks/[id]/status - タスクステータス変更
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = validateUpdateTaskStatus(body);

    // タスクの存在確認とアクセス権限チェック
    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
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
      },
    });

    if (!task) {
      throw new NotFoundError('タスク');
    }

    // ステータス更新
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status: data.status,
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
      data: updatedTask as Task,
    };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
