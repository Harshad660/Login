const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");

// ✅ Signup Controller
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields (name, email, password) are required",
      });
    }

    // 2. Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User already exists, please login",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // 5. Respond success
    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("❌ Signup error:", err.message, err.stack);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅ Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errorMsg = "Invalid email or password";

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // 2. Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({ success: false, error: errorMsg });
    }

    // 3. Compare passwords
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ success: false, error: errorMsg });
    }

    // 4. Generate JWT
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing in .env");
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 5. Respond success
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message, err.stack);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅ Export
module.exports = { signup, login };
