import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resetPasswordToken: { type: String, required: true },
  resetPasswordExpire: { type: Date, required: true },
});

const Password = mongoose.model("Password", passwordSchema);
export default Password;
