import NextAuth from 'next-auth';
import { authConfig } from './config';

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// セッション取得のヘルパー関数をエクスポート
export { getSession, getCurrentUser } from './middleware';
