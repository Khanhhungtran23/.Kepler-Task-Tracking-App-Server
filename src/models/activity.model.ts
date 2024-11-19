import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema(
  {
    title: {
      type: String,
      enum: [
        "Requirement Clarification",
        "Implementation",
        "QC1",
        "UAT",
        "QC2",
        "Deployment",
      ],
      default: "Requirement Clarification",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
