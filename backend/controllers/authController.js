import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc Register new user
// @route POST /api/auth/register

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields." });
    }
    // Check if the user exists or not ->
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create the user
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        message: "User registered successfully",
        token: generateToken(user._id)
      })
    }
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

// @desc Login user
// @route POST /api/auth/login

export const loginUser = async (req,res) =>{
  try {
    
  } catch (error) {
    res.status(500).json({message: "Server Error"})
  }
}
// @desc Get profile
// @route GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Profile Error" });
  }
};

// @desc Update profile
// @route PUT /api/auth/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password; // pre-save hook hashes it
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};
