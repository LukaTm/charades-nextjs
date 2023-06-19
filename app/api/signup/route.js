import connectDB from "@/mongo/connectDB";
import { NextResponse } from "next/server";
import User from "@/mongo/models/User";

import bcrypt from "bcrypt";

export const POST = async (req, res) => {
    const {
        nicknameValue: nickname,
        emailValue: email,
        passwordValue: password,
    } = await req.json();

    if (!nickname || !email || !password) {
        return NextResponse.json(
            { error: "Missing input field" },
            { status: 400 }
        );
    }

    if (nickname.length > 56 || email.length > 254 || password.length > 46) {
        return NextResponse.json(
            { error: "Invalid input length" },
            { status: 400 }
        );
    }
    try {
        await connectDB();
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email: email,
            password: hashedPassword,
            nickname: nickname,
        });

        await user.save();
        return NextResponse.json({ message: "User created" }, { status: 201 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
};
