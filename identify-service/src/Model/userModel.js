import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isactive: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    lastlogin: {
      type: Date,
      default: new Date(),
    },
    refresh_token: {
      type: String,
    },
    isverfied: {
      type: Boolean,
      default: false,
    },
    profile: {
      bio: {
        type: String,
      },
      skills: [{ type: String }],
      education: [{ type: String }],
      experience: {
        type: String,
      },
      location: {
        type: String,
      },
      resume: {
        type: String,
        default: "",
      },
      profilephoto: {
        type: String,
        default: "",
      },
      originalname: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);

export default user;
