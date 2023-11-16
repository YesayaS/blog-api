import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  is_admin: { type: Boolean, default: false },
});

// Export model
export default model("User", UserSchema);
