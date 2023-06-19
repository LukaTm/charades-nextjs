import connectDB from "@/mongo/connectDB";
import { Model } from "mongoose";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import CharadesWords from "@/mongo/models/Charades-words";
import CharadesWordsLatvians from "@/mongo/models/Charades-words-latvians";
import CharadesWordsRussians from "@/mongo/models/Charades-words-russians";

let existingArray = [];
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();
    const data = await req.json();

    let category = data.category;
    const numWords = data.numWords;
    let language = data.language;
    // const userId = data.userId;

    if (numWords > 50) {
        return NextResponse.json(
            {
                message: "Too many words requested",
            },
            { status: 400 }
        );
    }
    // Convert to lowercase
    if (category) {
        category = category.toLowerCase();
    } else {
        return NextResponse.json(
            {
                message: "No selected category",
            },
            { status: 400 }
        );
    }
    if (language) {
        language = language.toLowerCase();
    } else {
        return NextResponse.json(
            {
                message: "No selected language",
            },
            { status: 400 }
        );
    }

    try {
        // Retrieve the collection
        let AllWords;

        // Retrieve the collection based on language
        switch (language) {
            case "english":
                AllWords = CharadesWords;
                break;
            case "russian":
                AllWords = CharadesWordsRussians;
                break;
            case "latvian":
                AllWords = CharadesWordsLatvians;
                break;
            default:
                throw new Error("Invalid language");
        }

        await connectDB();
        // Find the document containing allWords
        const document = await AllWords.findOne();

        // Select the array 'easy', 'medium', 'hard'

        let selectedArray;
        if (category === "easy") {
            selectedArray = document.easy;
        } else if (category === "medium") {
            selectedArray = document.medium;
        } else if (category === "hard") {
            selectedArray = document.hard;
        } else {
            return NextResponse.json(
                {
                    message: "Invalid category",
                },
                { status: 400 }
            );
        }

        // Select random values from the array, excluding existing values
        const numRandomValues = numWords;

        async function getRandomUniqueValues(array, numValues, existingValues) {
            const uniqueValues = [];

            if (array.length <= numValues) {
                return array;
            }

            // Filter Duplicates
            const availableValues = array.filter(
                (value) =>
                    !existingValues.includes(value) &&
                    !uniqueValues
                        // convert to Lower case to compare them
                        .map((val) => val.toLowerCase())
                        .includes(value.toLowerCase())
            );

            for (let i = 0; i < numValues; i++) {
                const randomIndex = Math.floor(
                    Math.random() * availableValues.length
                );
                if (availableValues[randomIndex] !== undefined) {
                    uniqueValues.push(availableValues[randomIndex]);
                    existingArray.push(availableValues[randomIndex]);
                    availableValues.splice(randomIndex, 1);
                }
            }

            if (uniqueValues.length < 1) {
                return null;
            }
            return uniqueValues;
        }

        let charadesWords;
        charadesWords = await getRandomUniqueValues(
            selectedArray,
            numRandomValues,
            existingArray
        );
        if (charadesWords === null) {
            existingArray.length = 0;
            charadesWords = await getRandomUniqueValues(
                selectedArray,
                numRandomValues,
                existingArray
            );
        }

        return NextResponse.json(
            {
                charadesWords,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
    }
}
