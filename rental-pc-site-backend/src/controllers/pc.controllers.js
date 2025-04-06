import mongoose from "mongoose";
import { PC } from "../models/pc.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { RentalPc } from "../models/rentalpc.model.js";
import { ObjectId } from "mongodb";

const uploadPCImg = async function (postPCLocalPath) {
  if (!postPCLocalPath) {
    return "";
  }

  const pcImg = await uploadOnCloudinary(postPCLocalPath);

  return pcImg;
};

export const addPC = async (req, res) => {
  try {
    const pcImg = req.file?.path;
    if (!pcImg) {
      return res.status(400).json({
        error: "PC image is not provided.",
      });
    }

    const { name, specs, desc, rentPerHour, rentPerDay } = req.body;

    if (!name?.trim() || !specs?.trim() || !desc?.trim()) {
      return res.status(400).json({
        error: "required fields are empty.",
      });
    }

    const pcImgUrl = await uploadPCImg(pcImg);
    if (!pcImgUrl) {
      return res.status(500).json({
        error: "Image can't be uploaded ",
      });
    }

    const pc = await PC.create({
      name: name,
      specs: specs.split(","),
      desc: desc,
      image: pcImgUrl.url,
      rentPerDay: rentPerDay,
      rentPerHour: rentPerHour,
    });

    return res.status(201).json({
      message: "PC inserted successfully",
      data: pc,
    });
  } catch (error) {
    console.log("error in inserting pc:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllPCs = async (req, res) => {
  try {
    const pcs = await PC.aggregate([
      {
        $lookup: {
          from: "rentalpcs", // Collection to join
          localField: "_id", // Field from pcs
          foreignField: "pcId", // Field from rentalPC
          as: "rentals", // Result array field
        },
      },
      {
        $addFields: {
          lifetime_earning: {
            $sum: "$rentals.totalPayment", // Sum all totalPayments for each PC
          },
        },
      },
    ]);

    return res.status(200).json({
      message: "PCs fetched successfully",
      data: pcs,
    });
  } catch (error) {
    console.log("error in fetching PCs");
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getPCById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        error: "PC ID is required.",
      });
    }

    const mongoPCId = ObjectId.createFromHexString(id);

    const pc = await PC.findById(mongoPCId);

    if (!pc) {
      return res.status(404).json({
        error: "PC not found.",
      });
    }

    return res.status(200).json({
      message: "PC fetched successfully",
      data: pc,
    });
  } catch (error) {
    console.log("error in fetching PC by ID", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deletePCById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        error: "PC ID is required.",
      });
    }

    const mongoPCId = ObjectId.createFromHexString(id);

    const pc = await PC.findByIdAndDelete(mongoPCId);

    if (!pc) {
      return res.status(404).json({
        error: "PC not found.",
      });
    }

    return res.status(200).json({
      message: "PC deleted successfully",
      data: pc,
    });
  } catch (error) {
    console.log("error in deleting PC by ID");
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getPCByUserId = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "user id is required.",
      });
    }

    const mongoUserId = ObjectId.createFromHexString(userId);

    const result = await RentalPc.aggregate([
      {
        $match: { userId: mongoUserId },
      },
      {
        $lookup: {
          from: "pcs",
          localField: "pcId",
          foreignField: "_id",
          as: "pcDetails",
        },
      },
    ]);

    if (result.length == 0) {
      return res.status(404).json({ error: "No pc found" });
    }

    return res.status(200).json({ pcs: result });
  } catch (error) {
    console.log("error in getting all PC by User Id", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
