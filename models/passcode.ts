import { Schema, model } from "mongoose";

const PasscodeSchema = new Schema({
  admin: { type: String, required: true },
});

// Export model
export default model("Passcode", PasscodeSchema);
