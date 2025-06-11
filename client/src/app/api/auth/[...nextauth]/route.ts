import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import axiosInstance from "@/utils/axios";
import { cookies } from "next/headers";

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {

        async jwt({ token, account, profile }: any) {

            if (account && profile) {
                token.accessToken = account.access_token;
                const { provider } = account
                const { name, email } = profile
                let res: any = await axiosInstance.post(`/auth/oauth/${account.provider}`, {
                    id: provider == "google" ? profile?.sub : profile.id,
                    profilePhoto: provider == "google" ? profile.picture : profile.picture.data.url,
                    email: email,
                    name: name
                })

                const cookieStore = await cookies()
                if (res.data.success) {
                    cookieStore.set("token", res.data.token);

                }
            }
            return token;
        },
        async session({ session, token }) {
            (session as any).accessToken = token.accessToken;
            (session as any).token = token.token;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
