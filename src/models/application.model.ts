import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      assets: [String],
      status: {
        type: String,
        enum: ['To Do', 'Implementing', 'Testing', 'Go Live'],
        required: true,
      },
      isTrashed: { type: Boolean, default: false },
      priority: { type: Number, required: true },
      tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
      activities: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
      teamMembers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Assuming you have a User schema
    },
    { timestamps: true }
  );
  
  const Application = mongoose.model("Application", applicationSchema);
  export default Application;
  