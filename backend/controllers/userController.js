const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { user } = req.body;
  try {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(user.geslo, 10);
    const newUser = await User.create({
      ime: user.ime,
      priimek: user.priimek,
      email: user.email,
      geslo: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    User.getAll((err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Failed to retrieve users" });
      }
      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
      res.status(200).json(results);
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  const { user } = req.body;

  try {
    User.findByEmail(user.email, async (error, results) => {
      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "User does not exist" });
      }

      const userFromDb = results[0];

      const isMatch = await bcrypt.compare(user.geslo, userFromDb.geslo);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: userFromDb.id,
          email: userFromDb.email,
          name: userFromDb.ime,
          lastName: userFromDb.priimek,
          type: userFromDb.tip_uporabnika_id,
        },
        "process.env.JWT_SECRET",
        { expiresIn: "1h" }
      );

      res
        .status(200)
        .json({ message: "Login successful", token, userId: userFromDb.id });
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLoggedInUser = async (req, res) => {
  if (!req.userId) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  try {
    const result = await User.findById(req.userId);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    const { id, ime, priimek, email } = result;
    res.status(200).json({ id, ime, priimek, email });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleUserTypeById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newUserType = user.tip_uporabnika_id === 1 ? 2 : 1;
    user.tip_uporabnika_id = newUserType;
    await user.save();

    res.status(200).json({
      message: "User type updated successfully",
      user: { ...user, tip_uporabnika_id: newUserType },
    });
  } catch (error) {
    console.error("Error in toggleUserTypeById:", error);
    res.status(500).json({ message: "Server error" });
  }
};
