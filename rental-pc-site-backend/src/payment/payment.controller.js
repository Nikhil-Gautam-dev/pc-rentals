import { RentalPc } from "../models/rentalpc.model.js";
import { ObjectId } from "mongodb";
import Razorpay from "razorpay";
import crypto from "crypto";

const getRazorpayInstance = async () => {
  const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });

  return razorpay;
};

export const createOrder = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(404).json({ error: "No order id found" });
    }

    const mongoOrderID = ObjectId.createFromHexString(id);

    const order = await RentalPc.findById(mongoOrderID);

    if (!order) {
      return res.status(404).json({ error: "No order id found" });
    }

    const options = {
      amount: order.totalPayment * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const razorpay = await getRazorpayInstance();

    const razorpayOrder = await razorpay.orders.create(options);

    console.log(razorpayOrder);

    return res.status(201).json({
      success: true,
      message: "order created sucessfully",
      order: razorpayOrder,
    });
  } catch (error) {
    console.log("error in creating order", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature != expectedSign) {
      res.status(400).json({ verified: false });
    }

    const mongoOrderID = ObjectId.createFromHexString(orderId);

    await RentalPc.findOneAndUpdate(
      {
        _id: mongoOrderID,
      },
      {
        $set: {
          paymentInfo: {
            paymentMethod: "Online",
            transactionId: razorpay_payment_id,
            paymentStatus: "Completed",
          },
        },
      }
    );

    res.status(200).json({ verified: true });
  } catch (error) {
    console.log("error in verification of order", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMetaData = async (req, res) => {
  try {
    const insurancePrice = parseFloat(process.env.insurancePrice);
    const deliveryPrice = parseFloat(process.env.deliveryPrice);
    const taxRate = parseFloat(process.env.taxRate);

    return res
      .status(200)
      .json({ meta: { insurancePrice, deliveryPrice, taxRate } });
  } catch (error) {
    console.log("error in getting meta data", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
