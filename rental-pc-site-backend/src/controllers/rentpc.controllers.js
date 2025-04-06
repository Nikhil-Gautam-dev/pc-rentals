import mongoose from "mongoose";
import { RentalPc } from "../models/rentalpc.model.js";
import { PC } from "../models/pc.model.js";

const calculateTotalPayment = (pc, duration, isHourly = false) => {
  const insurancePrice = 49;
  const deliveryPrice = 25;
  const taxRate = 0.087;

  const price = isHourly ? pc.rentPerHour : pc.rentPerDay;
  const goodPrice = price * duration;

  const taxPrice = Math.round(goodPrice * taxRate);
  const totalPriceValue = goodPrice + insurancePrice + deliveryPrice + taxPrice;

  return {
    insurancePrice,
    deliveryPrice,
    taxRate,
    taxPrice,
    goodPrice,
    totalPriceValue,
  };
};

export const rentPc = async (req, res) => {
  try {
    const { pcId, startDate, endDate, hours, duration } = req.body;

    const mongoPCId = mongoose.Types.ObjectId.createFromHexString(pcId);
    const mongoUserId = mongoose.Types.ObjectId.createFromHexString(
      req.user.id
    );

    const pcExist = await PC.findById(mongoPCId);

    if (!pcExist) {
      return res.status(404).json({ error: "PC doesn't exist" });
    }

    // Optional: Validate dates if needed
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start.getTime() > end.getTime()) {
      return res
        .status(400)
        .json({ error: "Start date must be before end date." });
    }

    const {
      insurancePrice,
      deliveryPrice,
      taxRate,
      taxPrice,
      goodPrice,
      totalPriceValue,
    } = calculateTotalPayment(pcExist, duration, hours != 0);

    const newRent = new RentalPc({
      pcId: mongoPCId,
      userId: mongoUserId,
      rentalPeriod: {
        startDate: startDate,
        endDate: endDate,
      },
      orderInfo: {
        insurancePrice,
        deliveryPrice,
        taxRate,
        taxPrice,
        totalPrice: totalPriceValue,
        basePrice: goodPrice,
      },
      totalPayment: totalPriceValue,
      hours: hours,
    });

    const newRentCreated = await RentalPc.create(newRent);

    return res.status(201).json({
      success: true,
      message: "new rent created successfully",
      data: newRentCreated,
    });
  } catch (error) {
    console.log("error occurred in renting pc : ", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ error: "Order not found !" });
    }

    const mongoOrderId = mongoose.Types.ObjectId.createFromHexString(orderId);

    const data = await RentalPc.aggregate([
      { $match: { _id: mongoOrderId, "paymentInfo.paymentStatus": "Pending" } },
      {
        $lookup: {
          from: "pcs",
          localField: "pcId",
          foreignField: "_id",
          as: "pcDetails",
        },
      },
      {
        $unwind: "$pcDetails",
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$pcDetails", "$$ROOT"],
          },
        },
      },
      {
        $project: {
          pcDetails: 0,
        },
      },
    ]);

    if (data.length == 0) {
      return res.status(404).json({ error: "no order found!" });
    }

    return res.status(200).json({
      message: "success",
      data: data[0],
    });
  } catch (error) {
    console.log("error occurred in getting order by id : ", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
