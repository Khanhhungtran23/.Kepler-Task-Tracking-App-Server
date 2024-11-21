import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assets: [{ type: String, description: "URL of document files" }],
    status: {
      type: String,
      enum: ["To Do", "Implement", "Testing", "Production"],
      default: "To Do",
      required: true,
    },
    isTrashed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["None", "Low", "Medium", "High"],
      default: "None",
      required: true,
    },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    activities: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Activity" },
        title: { type: Schema.Types.String },
        comment: { type: Schema.Types.String },
        user_name: { type: Schema.Types.String },
      },
    ],
    teamMembers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
