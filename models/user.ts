import { Schema, model } from "mongoose";

interface User {
  username: string;
  password: string;
  is_admin: Boolean;
}

const UserSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  is_admin: { type: Boolean, default: false },
});

// Export model
export default model("User", UserSchema);
