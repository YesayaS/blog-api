import { Schema, model } from "mongoose";

interface Passcode {
  admin: string;
}

const PasscodeSchema = new Schema<Passcode>({
  admin: { type: String, required: true },
});

// Export model
export default model("Passcode", PasscodeSchema);
