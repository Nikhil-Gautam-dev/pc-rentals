import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const structuredData = (users) => {
  const data = [];
  users.forEach((user) => {
    const temp = {
      _id: user._id,
      username: user.username,
      email: user.email,
      pcRented: user.rentals.map((rental) =>
        Object.keys(rental).length != 0 ? rental.pcDetail.name : null
      ),
      currentlyRented: user.rentals.map((rental) =>
        Object.keys(rental).length != 0 && !rental.returned
          ? rental.pcDetail.name
          : null
      ),
      totalLifeTimePayment: user.rentals.reduce(
        (total, rental) =>
          Object.keys(rental).length != 0 ? (total += rental.totalPayment) : 0,
        0
      ),
      pendingPayment: user.rentals.reduce((total, rental) => {
        if (
          Object.keys(rental).length != 0 &&
          rental.paymentInfo.paymentStatus === "Pending"
        ) {
          total += rental.totalPayment;
        }
        return total;
      }, 0),
    };

    data.push(temp);
  });

  return data;
};

// User Signup Controller
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await User.insertOne(newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// User Login Controller
export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const userObject = user.toObject();
    delete userObject["password"];
    delete userObject["admin"];

    res.status(200).json({
      message: "Login successful",
      token,
      user: userObject,
      expires: 1000 * 60 * 60 * 24,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Super User Signin Controller
export const superUserSignin = async (req, res) => {
  try {
    const { email, username, password, superKey } = req.body;

    // Check if superKey matches
    if (superKey !== process.env.SUPER_USER_KEY) {
      return res.status(403).json({ error: "Invalid super user key" });
    }

    // Check if user exists
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user is an admin
    if (!user.admin) {
      return res.status(403).json({ error: "User is not an admin" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, isAdmin: true },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({ message: "Super user login successful", token });
  } catch (error) {
    console.log("error occured while signing super user, ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get User Profile Controller
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user after authentication

    // Fetch user details excluding the password
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signupUsingPasskey = async (req, res) => {
  try {
    const { superKey } = req.body;

    if (!superKey) {
      return res.status(401).json({ error: "Invalid super user key" });
    }

    const admin = await User.findOne({ passkey: superKey });

    if (!admin) {
      return res.status(401).json({ error: "Invalid super user key" });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const adminObject = admin.toObject();

    delete adminObject.passkey;
    delete adminObject.password;

    res.status(200).json({
      message: "Super user login successful",
      token,
      user: adminObject,
      expires: 1000 * 60 * 60 * 24,
    });
  } catch (error) {
    console.log(
      "error occured while signing super user using passkey, ",
      error
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      { $match: { admin: false } },
      {
        $lookup: {
          from: "rentalpcs",
          localField: "_id",
          foreignField: "userId",
          as: "rentals",
        },
      },
      {
        $unwind: {
          path: "$rentals",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "pcs",
          localField: "rentals.pcId",
          foreignField: "_id",
          as: "rentalPcDetail",
        },
      },
      {
        $addFields: {
          "rentals.pcDetail": { $arrayElemAt: ["$rentalPcDetail", 0] },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          username: { $first: "$username" },
          rentals: { $push: "$rentals" },
        },
      },
    ]);

    const data = structuredData(users);

    if (!data.length) {
      return res.status(404).json({ error: "Users not found" });
    }

    return res.status(200).json({
      message: "Users fetched successfully",
      data: data,
    });
  } catch (error) {
    console.log("error in fetching Users, ", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
