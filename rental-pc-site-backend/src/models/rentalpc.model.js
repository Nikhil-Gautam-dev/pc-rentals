import mongoose from "mongoose";

export const rentalPcSchema = new mongoose.Schema({
  pcId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PC",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paymentInfo: {
    paymentMethod: { type: String, default: "Online" },
    transactionId: { type: String, default: "" },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  rentalPeriod: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  orderInfo: {
    basePrice: { type: Number, required: true },
    insurancePrice: { type: Number, required: true },
    deliveryPrice: { type: Number, required: true },
    taxRate: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  totalPayment: Number,
  hours: {
    type: Number,
    default: 0,
  },
  returned: {
    type: Boolean,
    default: false,
  },
});

export const RentalPc = mongoose.model("RentalPc", rentalPcSchema);
