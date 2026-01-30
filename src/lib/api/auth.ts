import { getServerSession } from 'next-auth';
import type { NextRequest } from 'next/server';
import { UnauthorizedError, ForbiddenError } from './errors';
import type { User } from '@/types';

// セッション取得ヘルパー
export async function getSession() {
  // NextAuthのセッションを取得
  const { authOptions } = await import('@/app/api/auth/[...nextauth]/route');
  const session = await getServerSession(authOptions);
  return session;
}

// 認証チェック
export async function requireAuth(): Promise<{ userId: string }> {
  const session = await getSession();
  
  if (!session || !session.user) {
    throw new UnauthorizedError();
  }

  const userId = (session.user as { id?: string }).id || session.user.email;
  if (!userId) {
    throw new UnauthorizedError();
  }

  return {
    userId: typeof userId === 'string' ? userId : userId.toString(),
  };
}

// プロジェクト権限チェック
export function checkProjectPermission(
  userRole: string,
  projectRole: string | undefined,
  requiredRole: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER' = 'VIEWER'
): void {
  if (!projectRole) {
    throw new ForbiddenError('プロジェクトのメンバーではありません');
  }

  const roleHierarchy: Record<string, number> = {
    VIEWER: 1,
    MEMBER: 2,
    ADMIN: 3,
    OWNER: 4,
  };

  if (roleHierarchy[projectRole] < roleHierarchy[requiredRole]) {
    throw new ForbiddenError(`この操作には${requiredRole}以上の権限が必要です`);
  }
}
