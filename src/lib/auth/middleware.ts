import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * 認証が必要なルートを保護するミドルウェア
 */
export async function authMiddleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // 認証ページ（ログイン・登録）へのアクセス
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  
  // 認証が必要なページ（認証ページ以外）
  const isProtectedRoute = !isAuthPage && pathname !== '/' && !pathname.startsWith('/api');

  if (isAuthPage) {
    // 既にログインしている場合はホームにリダイレクト
    if (session?.user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (isProtectedRoute && !session?.user) {
    // 未認証の場合はログインページにリダイレクト
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * セッションを取得するヘルパー関数
 */
export async function getSession() {
  return await auth();
}

/**
 * 現在のユーザーを取得するヘルパー関数
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}
