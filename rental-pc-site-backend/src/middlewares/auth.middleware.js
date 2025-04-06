import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { User } from "../models/user.model.js";

const jwtVerify = async (req, res, next) => {
  const token =
    (await req.cookies?.accessToken) ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;

    console.log(userId);

    if (!userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const isAdmin = await User.findOne({
      _id: ObjectId.createFromHexString(userId),
      admin: true,
    });

    console.log(isAdmin);

    if (!isAdmin) {
      return res.status(400).json({ error: "Unauthorized User" });
    }
    next();
  } catch (error) {
    console.log("error in verifying admin ", error);
    return res.status(500).json({ error: "something went wrong!" });
  }
};

export default jwtVerify;
