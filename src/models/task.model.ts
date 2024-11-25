import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    deadline: { type: Date, required: true }, // Add the deadline field
    // assets: [{ type: String, description: "URL of document files" }],
    tag: { type: String, required: true }, // icon for the task
    status: {
      type: String,
      enum: ["To Do", "In progress", "Done"],
      default: "To Do",
      required: true,
    },
  },
  // team: [{ type: Schema.Types.ObjectId, ref: "User" }], // assign to member
  // priority: {
  //   type: String,
  //     enum: ['None', Low', 'Medium', 'High'],
  //     default: "None",
  //     required: true },
  // },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
