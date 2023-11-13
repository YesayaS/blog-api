import { Schema, model } from "mongoose";

interface Comment {
  content: string;
  date: Date;
  author: Boolean;
}

const CommentSchema = new Schema<Comment>({
  content: { type: String, required: true },
  date: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Export model
export default model("Comment", CommentSchema);
