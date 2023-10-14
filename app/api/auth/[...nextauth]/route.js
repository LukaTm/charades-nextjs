import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import connectDB from "@/mongo/connectDB";
import User from "@/mongo/models/User";

import bcrypt from "bcrypt";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        CredentialsProvider({
            name: "credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // check to see if email and password is there
                if (
                    !credentials ||
                    !credentials.email ||
                    !credentials.password
                ) {
                    return null;
                }

                const { email, password } = credentials;
                const connection = await connectDB();

                // check to see if user exists
                const user = await User.findOne({ email });

                // if no user was found
                if (!user) {
                    return null;
                }
                // check to see if password matches
                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                // if password does not match
                if (!passwordMatch) {
                    return null;
                }
                return {
                    email: email,
                    name: user._id.toString(),
                };
            },
        }),
    ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
