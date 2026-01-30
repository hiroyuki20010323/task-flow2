import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError, NotFoundError, ForbiddenError } from '@/lib/api/errors';
import { validateUpdateTask } from '@/lib/api/validation';
import type { ApiResponse, Task } from '@/types';

// GET /api/tasks/[id] - タスク詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id } = await params;

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
                },
              },
            },
          ],
        },
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

    if (!task) {
      throw new NotFoundError('タスク');
    }

    const response: ApiResponse<Task> = {
      success: true,
      data: task as Task,
    };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/tasks/[id] - タスク更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = validateUpdateTask(body);

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
      include: {
        project: true,
      },
    });

    if (!task) {
      throw new NotFoundError('タスク');
    }

    // アサイン先ユーザーの存在確認（指定されている場合）
    if (data.assigneeId !== undefined && data.assigneeId !== null) {
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
            projectId: task.projectId,
            userId: data.assigneeId,
          },
        },
      });

      if (!isMember && task.project.ownerId !== data.assigneeId) {
        throw new ForbiddenError('アサイン先ユーザーはプロジェクトのメンバーではありません');
      }
    }

    // 更新
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.status && { status: data.status }),
        ...(data.priority && { priority: data.priority }),
        ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
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

// DELETE /api/tasks/[id] - タスク削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id } = await params;

    // タスクの存在確認と権限チェック（OWNER、ADMIN、または作成者のみ削除可能）
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
                    in: ['OWNER', 'ADMIN'],
                  },
                },
              },
            },
          ],
        },
      },
    });

    if (!task) {
      // 作成者かチェック
      const creatorTask = await prisma.task.findFirst({
        where: {
          id,
          creatorId: userId,
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
        },
      });

      if (!creatorTask) {
        throw new NotFoundError('タスク');
      }
    }

    await prisma.task.delete({
      where: { id },
    });

    const response: ApiResponse = {
      success: true,
    };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
