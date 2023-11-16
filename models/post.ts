import { Schema, model, Types } from "mongoose";

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  publication_date: { type: Date },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  is_published: { type: Boolean, required: true, default: true },
});

// Virtual for bookinstance's URL
PostSchema.virtual("url").get(function () {
  return `/post/${this._id}`;
});

// Export model
export default model("Post", PostSchema);
