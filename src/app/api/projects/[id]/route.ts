import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError, NotFoundError, ForbiddenError } from '@/lib/api/errors';
import { validateUpdateProject } from '@/lib/api/validation';
import type { ApiResponse, Project } from '@/types';

// GET /api/projects/[id] - プロジェクト詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id } = await params;

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
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundError('プロジェクト');
    }

    const response: ApiResponse<Project> = {
      success: true,
      data: project as Project,
    };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/projects/[id] - プロジェクト更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = validateUpdateProject(body);

    // プロジェクトの存在確認と権限チェック
    const project = await prisma.project.findFirst({
      where: {
        id,
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
    });

    if (!project) {
      throw new NotFoundError('プロジェクト');
    }

    // 更新
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description || null }),
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const response: ApiResponse<Project> = {
      success: true,
      data: updatedProject as Project,
    };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/projects/[id] - プロジェクト削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id } = await params;

    // プロジェクトの存在確認と権限チェック（オーナーのみ削除可能）
    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new NotFoundError('プロジェクト');
    }

    await prisma.project.delete({
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
