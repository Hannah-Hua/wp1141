import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Facebook from "next-auth/providers/facebook"
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // 允許 Vercel 等託管平台使用
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false;

      try {
        await connectDB();
        
        const existingUser = await User.findOne({
          provider: account.provider,
          providerId: account.providerAccountId,
        });

        // 如果用戶已存在，直接登入
        if (existingUser) {
          return true;
        }

        // 如果用戶不存在，檢查是否從註冊流程來的（callbackUrl 包含 /auth/register）
        // 如果是，導向註冊頁面輸入 userID
        // 否則，導向註冊頁面（但這應該不會發生，因為新用戶應該先選擇 Provider 註冊）
        return `/auth/register?provider=${account.provider}&providerId=${account.providerAccountId}&name=${encodeURIComponent(user.name || '')}&email=${encodeURIComponent(user.email || '')}&image=${encodeURIComponent(user.image || '')}`;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },
    async session({ session, token }) {
      // 從 JWT token 中取得用戶資訊，避免每次查資料庫
      if (session.user && token.userId && token.userMongoId) {
        session.user = {
          ...session.user,
          id: token.userMongoId as string,
          userId: token.userId as string,
        } as any;
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.provider = account.provider;
        token.providerId = account.providerAccountId;
      }
      
      // 只有在首次登入或 token 中沒有用戶資訊時才查資料庫
      if ((account || !token.userId) && token.provider && token.providerId) {
        try {
          await connectDB();
          const dbUser = await User.findOne({
            provider: token.provider as string,
            providerId: token.providerId as string,
          }).select('_id userId');

          if (dbUser) {
            token.userId = dbUser.userId;
            token.userMongoId = dbUser._id.toString();
          }
        } catch (error) {
          console.error('JWT error:', error);
        }
      }
      
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 10 * 60, // 10 分鐘過期
    updateAge: 60, // 每 60 秒檢查一次 session 狀態
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Host-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
})

