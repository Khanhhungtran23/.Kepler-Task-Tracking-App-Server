import mongoose, { Schema } from "mongoose";

const noticeSchema = new Schema(
  {
    team: [{ type: Schema.Types.ObjectId, ref: "User" }], // user or a group of people recieve the noti
    text: { type: String, required: true }, // content
    application: { type: Schema.Types.ObjectId, ref: "Application" }, // app related
    task: { type: Schema.Types.ObjectId, ref: "Task" }, // task related if yes
    sender: { type: Schema.Types.ObjectId, ref: "User" }, // User who send message, if this is message noti type
    notiType: {
      type: String,
      default: "alert",
      enum: ["alert", "message", "assignment"], // Noti type: alert, message, or assignment
    },
    isRead: [{ type: Schema.Types.ObjectId, ref: "User" }], // User read noti yet ?
  },
  { timestamps: true },
);

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
