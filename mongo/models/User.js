import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    posts: [
        {
            content: {
                type: String,
            },
            customName: {
                type: Schema.Types.ObjectId,
                ref: "CustomName",
            },
        },
    ],
});

// If already defined dont reload
export default mongoose.models.User || mongoose.model("User", userSchema);
