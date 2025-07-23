import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: String,
  address: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});


doctorSchema.index({ location: "2dsphere" });

export default mongoose.model("Doctor", doctorSchema);
