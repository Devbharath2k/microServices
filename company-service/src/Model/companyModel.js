import mongoose from "mongoose";

const { Schema } = mongoose;

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    website: {
      type: String,
    },
    location: [{ type: String }],
    experience: {
      type: String,
    },
    logo: {
      type: String,
      default: "",
    },
    mediaId: [{ type: String }],

    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        requried : true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
  },
  { timestamps: true }
);

const Company = mongoose.model("company", companySchema);

export default Company;
