import mongoose from "mongoose";

const pcSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      default: "Ant PC Argentine RZ900X Gaming Desktop PC",
    },
    specs: {
      type: [String],
      required: true,
    },
    rentPerHour: {
      type: Number,
      default: 50,
    },
    rentPerDay: {
      type: Number,
      default: 50,
    },
    rented: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const PC = mongoose.model("pcs", pcSchema);
