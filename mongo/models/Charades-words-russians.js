const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const charadesWordsRussiansSchema = new Schema({
    easy: [{ type: String }],
    medium: [{ type: String }],
    hard: [{ type: String }],
});

export default mongoose.models["Charades-words-russians"] ||
    mongoose.model("Charades-words-russians", charadesWordsRussiansSchema);
