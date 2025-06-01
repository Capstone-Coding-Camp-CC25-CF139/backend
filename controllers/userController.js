import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  getUserByUsername,
  getUserByEmail,
  createUser,
  getAllUsers,
} from "../models/userModel.js";

// v1
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ uid: user.uid, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  const { username, email, name, password } = req.body;

  try {
    try {
      await getUserByUsername(username);
      return res.status(409).json({ message: "Username already exists" });
    } catch (_) {}

    try {
      await getUserByEmail(email);
      return res.status(409).json({ message: "Email already registered" });
    } catch (_) {}

    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await createUser(username, email, name, hashedPassword);

    res.status(201).json({ message: "User registered successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// TESTING ROUTES
// export const login = (req, res) => {
//   try {
//     res.json({ message: "Register works" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };