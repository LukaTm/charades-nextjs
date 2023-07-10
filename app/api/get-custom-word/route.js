import connectDB from "@/mongo/connectDB";
import { NextResponse } from "next/server";
const ObjectId = require("mongodb").ObjectId;
import User from "@/mongo/models/User";

let customExistingArray = [];

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async (req, res) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { message: "Need to log in to get custom words" },
            { status: 401 }
        );
    }
    const userIdString = session.user.name;
    // convert to to ObjectId
    const userId = new ObjectId(userIdString);

    const { numWords } = await req.json();
    let repeatWords = false;

    try {
        await connectDB();
        const findUser = await User.findById(userId);
        const posts = findUser.posts;

        let filteredPosts;
        if (!repeatWords || customExistingArray.length === 0) {
            // Filter Duplicates if repeatWords is false or customExistingArray is empty
            filteredPosts = posts.filter(
                (value) => !customExistingArray.includes(value.content)
            );
        } else {
            // Use all posts if repeatWords is true and customExistingArray is not empty
            filteredPosts = posts;
        }

        let postsCopy = [];
        filteredPosts.forEach((element) => {
            postsCopy.push(element.content);
        });

        const randomArray = [];
        const numberOfTimes = Math.min(numWords, postsCopy.length);

        for (let i = 0; i < numberOfTimes; i++) {
            const randomIndex = Math.floor(Math.random() * postsCopy.length);
            const randomContent = postsCopy.splice(randomIndex, 1)[0];
            randomArray.push(randomContent);
            customExistingArray.push(randomContent);
        }

        if (postsCopy.length === 0) {
            customExistingArray = []; // Reset customExistingArray when all words have been used
        }

        // Send the randomArray as the response
        return NextResponse.json(
            {
                randomArray,
            },
            { status: 200 }
        );
    } catch (error) {
        // res.status(500).json({ message: "Failed" });
        console.log(error);
        return NextResponse.json(
            { message: "Failed get custom word" },
            { status: 500 }
        );
    }
};
