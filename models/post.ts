import { Schema, model, Types } from "mongoose";

// interface Post {
//   title: string;
//   content: string;
//   comment: Types.ObjectId;
//   publication_date: Date;
//   author: Types.ObjectId;
//   is_private: boolean;
// }

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  comment: { type: Schema.Types.ObjectId, ref: "Comment" },
  publication_date: { type: Date },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  is_private: { type: Boolean, required: true, default: true },
});

// Virtual for bookinstance's URL
PostSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/post/${this._id}`;
});

// Export model
export default model("Post", PostSchema);
