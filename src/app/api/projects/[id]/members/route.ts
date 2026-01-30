import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError, NotFoundError, ForbiddenError, ConflictError } from '@/lib/api/errors';
import { validateAddMember } from '@/lib/api/validation';
import type { ApiResponse, ProjectMember } from '@/types';

// GET /api/projects/[id]/members - プロジェクトメンバー一覧取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id } = await params;

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

    const members = await prisma.projectMember.findMany({
      where: {
        projectId: id,
      },
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
      orderBy: {
        joinedAt: 'asc',
      },
    });

    const response: ApiResponse<ProjectMember[]> = {
      success: true,
      data: members as ProjectMember[],
    };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/projects/[id]/members - プロジェクトメンバー追加
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = validateAddMember(body);

    // プロジェクトの存在確認と権限チェック（OWNERまたはADMINのみ追加可能）
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

    // ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundError('ユーザー');
    }

    // 既にメンバーかチェック
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: data.userId,
        },
      },
    });

    if (existingMember) {
      throw new ConflictError('このユーザーは既にプロジェクトのメンバーです');
    }

    // メンバー追加
    const member = await prisma.projectMember.create({
      data: {
        projectId: id,
        userId: data.userId,
        role: data.role,
      },
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
    });

    const response: ApiResponse<ProjectMember> = {
      success: true,
      data: member as ProjectMember,
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
