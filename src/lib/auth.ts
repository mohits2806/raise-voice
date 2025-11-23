import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import User from '@/models/User';
import clientPromise from './mongodb-client';

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(clientPromise) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                await dbConnect();

                const user = await User.findOne({ email: credentials.email }).select('+password');

                if (!user || !user.password) {
                    throw new Error('Invalid email or password');
                }

                const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);

                if (!isPasswordValid) {
                    throw new Error('Invalid email or password');
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role, // Include role here
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            // Set ID and initial role from user object when first signing in
            if (user) {
                token.id = user.id;
                token.role = user.role || 'user';
            }

            // Always fetch fresh role from database on every request
            if (token.id) {
                try {
                    await dbConnect();
                    const dbUser = await User.findById(token.id);

                    if (dbUser) {
                        // Update or set the role
                        token.role = dbUser.role || 'user';

                        // If user doesn't have a role yet (OAuth users), set it
                        if (!dbUser.role) {
                            await User.findByIdAndUpdate(token.id, { role: 'user' });
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    token.role = token.role || 'user';
                }
            }

            if (account?.provider) {
                token.provider = account.provider;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = (token.role as string) || 'user';
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});
