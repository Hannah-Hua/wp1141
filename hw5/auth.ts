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

        if (existingUser) {
          return true;
        }

        return `/auth/register?provider=${account.provider}&providerId=${account.providerAccountId}&name=${encodeURIComponent(user.name || '')}&email=${encodeURIComponent(user.email || '')}&image=${encodeURIComponent(user.image || '')}`;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user) {
        try {
          await connectDB();
          const user = await User.findOne({
            provider: token.provider as string,
            providerId: token.providerId as string,
          });

          if (user) {
            session.user = {
              ...session.user,
              id: user._id.toString(),
              userId: user.userId,
            } as any;
          }
        } catch (error) {
          console.error('Session error:', error);
        }
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider;
        token.providerId = account.providerAccountId;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
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

