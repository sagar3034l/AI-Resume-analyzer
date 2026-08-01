import User from "../model/User.js";
import { generateToken } from "./generateToken.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    if(password.length < 6){
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    } 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    generateToken(res, user._id);

    return res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    await user.save();
    generateToken(res, user._id);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.json({ message: "Logged out successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async(req,res)=>{
    try {
      const user = await User.findById(req.user._id).select("-password");
      res.status(200).json({ user })
    } catch (error) {
      console.error(error)
      res.status(500).json({message: "Internal server error"})
    }
}
