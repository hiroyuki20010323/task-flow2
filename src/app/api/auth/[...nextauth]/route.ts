import NextAuth, { type NextAuthOptions } from 'next-auth';

// Agent1が実装するauthOptionsをインポート
// 暫定的に基本的な設定を提供
export const authOptions: NextAuthOptions = {
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id: string }).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as { id: string }).id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
