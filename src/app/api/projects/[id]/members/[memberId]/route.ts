import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError, NotFoundError, ForbiddenError } from '@/lib/api/errors';
import { validateUpdateMemberRole } from '@/lib/api/validation';
import type { ApiResponse, ProjectMember } from '@/types';

// PATCH /api/projects/[id]/members/[memberId] - メンバーロール変更
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id, memberId } = await params;
    const body = await request.json();
    const data = validateUpdateMemberRole(body);

    // プロジェクトの存在確認と権限チェック（OWNERまたはADMINのみ変更可能）
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

    // メンバーの存在確認
    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: memberId,
        },
      },
    });

    if (!member) {
      throw new NotFoundError('メンバー');
    }

    // OWNERロールは変更不可
    if (member.role === 'OWNER') {
      throw new ForbiddenError('OWNERロールは変更できません');
    }

    // OWNERロールへの変更はプロジェクトオーナーのみ可能
    if (data.role === 'OWNER' && project.ownerId !== userId) {
      throw new ForbiddenError('OWNERロールへの変更はプロジェクトオーナーのみ可能です');
    }

    // ロール更新
    const updatedMember = await prisma.projectMember.update({
      where: {
        projectId_userId: {
          projectId: id,
          userId: memberId,
        },
      },
      data: {
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
      data: updatedMember as ProjectMember,
    };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/projects/[id]/members/[memberId] - メンバー削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id, memberId } = await params;

    // プロジェクトの存在確認と権限チェック（OWNERまたはADMINのみ削除可能）
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

    // メンバーの存在確認
    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: memberId,
        },
      },
    });

    if (!member) {
      throw new NotFoundError('メンバー');
    }

    // OWNERは削除不可
    if (member.role === 'OWNER') {
      throw new ForbiddenError('OWNERは削除できません');
    }

    // 自分自身の削除は可能（OWNERまたはADMINの場合）
    if (memberId === userId && member.role !== 'OWNER') {
      // 自分自身の削除は可能
    } else if (project.ownerId !== userId) {
      // プロジェクトオーナー以外は削除権限がない
      throw new ForbiddenError('メンバーの削除権限がありません');
    }

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: id,
          userId: memberId,
        },
      },
    });

    const response: ApiResponse = {
      success: true,
    };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
