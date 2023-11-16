import { Schema, model } from "mongoose";

const CommentSchema = new Schema({
  content: { type: String, required: true },
  date: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Export model
export default model("Comment", CommentSchema);
