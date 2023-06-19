import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import connectDB from "@/mongo/connectDB";
import User from "@/mongo/models/User";

import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
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
                if (!credentials) {
                    throw new Error("Please enter an email and password");
                }
                if (!credentials.email || !credentials.password) {
                    throw new Error("Please enter an email and password");
                }

                const { email, password } = credentials;
                const connection = await connectDB();

                // check to see if user exists
                const user = await User.findOne({ email });

                // if no user was found
                if (!user) {
                    throw new Error("No user found");
                }
                // check to see if password matches
                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                // if password does not match
                if (!passwordMatch) {
                    throw new Error("Incorrect password");
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
