import mongoose from "mongoose";

const { Schema } = mongoose;

const charadesWordsSchema = new Schema({
    easy: [{ type: String }],
    medium: [{ type: String }],
    hard: [{ type: String }],
});

// If already defined re-use it INSTEad of creating new one again
export default mongoose.models["Charades-Words"] ||
    mongoose.model("Charades-Words", charadesWordsSchema);
