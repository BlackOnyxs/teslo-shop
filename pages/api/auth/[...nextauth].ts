import NextAuth, { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import { dbUsers } from '@/database';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'correo', type: 'email', placeholder: 'email@google.com' },
        password: { label: 'Contraseña', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize( credentials ) {
        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
      }
    })
  ],
  // Custom pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  session: {
    maxAge: 86400, //1d
    strategy: 'jwt' as const,
    updateAge: 86400,
  },
  
  callbacks: {
    async jwt({ token, account, user }){
      if ( account ) {
        token.accessToken = account.access_token;

        switch ( account.type ) {
          case 'credentials':
            token.user = user;
            break;
        
          case 'oauth':
              token.user = await dbUsers.oAuthToDbUser(user!.email || '', user?.name || '');
            break;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken as any;
      session.user = token.user as any;
      return session;
    }
  }
};
export default NextAuth(authOptions);
