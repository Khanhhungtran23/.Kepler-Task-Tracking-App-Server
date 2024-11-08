import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    deadline: { type: Date, required: true }, // Add the deadline field
    assets: [String],
    tag: {type: String, required: true},
    status: {
      type: String,
        enum: ['To Do', 'In progress', 'Done'],
        default: "To Do",
        required: true,
    }
    // team: [{ type: Schema.Types.ObjectId, ref: "User" }], // assign to member
    // isTrashed: { type: Boolean, default: false },
    // priority: { type: Number, required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;