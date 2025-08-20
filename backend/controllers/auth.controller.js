import User from "../models/User.model.js";

export const updateProfile = async (req, res) => {
  try {
    const { age, address, role, phone, gender } = req.body;

    let user = await User.findOne({ auth0Id: req.oidc.user.sub });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (age !== undefined) user.age = age;
    if (address !== undefined) user.address = address;
    if (role !== undefined) user.role = role;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;

    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    let user = await User.findOne({ auth0Id: req.oidc.user.sub });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "user get success fully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
