import { getServerSession } from "next-auth";

import connectDB from "@/mongo/connectDB";
import { NextResponse } from "next/server";
const ObjectId = require("mongodb").ObjectId;
import User from "@/mongo/models/User";

import CustomName from "../../../mongo/models/CustomName";

import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async (req) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { message: "Need to log in to create custom words" },
            { status: 400 }
        );
    }

    const { customWord } = await req.json();
    const userIdString = session.user?.name;
    // convert to to ObjectId
    const userId = new ObjectId(userIdString);

    try {
        connectDB();
        const findUser = await User.findById(userId);

        // Check if the custom word already exists for the user
        const existingCustomName = findUser.posts.find(
            (post) => post.content === customWord
        );
        if (existingCustomName) {
            return res.status(400).json({
                message: "Custom Word already exists for the user",
                exists: true,
            });
        } else {
            const customName = new CustomName({
                content: customWord,
                creator: userId,
                viewers: userId,
            });

            await customName.save();

            findUser.posts.push({
                _id: customName._id,
                content: customName.content,
            });

            await findUser.save();

            return NextResponse.json(
                { message: "Custom word created succesfully" },
                { status: 201 }
            );
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Failed to create Custom Word" },
            { status: 500 }
        );
    }
};
