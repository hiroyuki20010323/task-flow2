import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { User, LoginCredentials } from '@/types';
import { verifyPassword, validateLoginCredentials } from './utils';

/**
 * ユーザーを取得する関数（実際の実装ではデータベースから取得）
 * この関数は後でデータベース接続に置き換える必要があります
 */
async function getUser(email: string): Promise<User | null> {
  // TODO: データベースからユーザーを取得
  // 現在はモック実装
  return null;
}

/**
 * NextAuth設定
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuthPage = nextUrl.pathname.startsWith('/login') || 
                          nextUrl.pathname.startsWith('/register');
      
      if (isOnAuthPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/', nextUrl));
        }
        return true;
      }
      
      return isLoggedIn;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const loginCredentials: LoginCredentials = {
          email: credentials.email as string,
          password: credentials.password as string,
        };

        // バリデーション
        const validation = validateLoginCredentials(loginCredentials);
        if (!validation.valid) {
          throw new Error(validation.message || '認証情報が無効です');
        }

        // ユーザーを取得
        const user = await getUser(loginCredentials.email);
        if (!user) {
          throw new Error('メールアドレスまたはパスワードが正しくありません');
        }

        // TODO: データベースからハッシュ化されたパスワードを取得して検証
        // 現在はモック実装
        // const isValid = await verifyPassword(
        //   loginCredentials.password,
        //   user.hashedPassword
        // );
        // if (!isValid) {
        //   throw new Error('メールアドレスまたはパスワードが正しくありません');
        // }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      },
    }),
  ],
};
