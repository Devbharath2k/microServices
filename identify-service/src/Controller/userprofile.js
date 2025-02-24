import user from "../Model/userModel.js";
import logger from "../Utils/logger.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userValidationSchema from "../Model/validateUserModel.js";
import getdatauri from "../Utils/datauri.js";
import cloudinary from "../Config/cloudnary.js";
import { AccessToken, Refreshtoken } from "../Middleware/generateToken.js";

const userController = {
  register: async (req, res) => {
    try {
      // Validate user input
      const { error } = userValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { fname, lname, email, password, role } = req.body;

      const existingUser = await user.findOne({ email });
      if (existingUser) {
        logger.warn("E-mail already in use");
        return res.status(400).json({ message: "Email already in use" });
      }

      let profilePhotoUrl = null;
      if (req.file) {
        const parser = getdatauri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(parser.content, {
          folder: "identify-service",
        });
        profilePhotoUrl = cloudResponse.secure_url;
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new user({
        fname,
        lname,
        email,
        role,
        password: hashedPassword,
        profile:{
          profilephoto : profilePhotoUrl
        }
      })
      await newUser.save();
      logger.info(`Successfully registered a new user`);
      return res.status(201).json({ message: "User registered successfully", success: true ,newUser });
    } catch (error) {
      logger.error(`Internal Server Error: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password, role } = req.body;
      if (!email || !password || !role) {
        logger.warn("Please provide all fields");
        return res.status(400).json({ message: "Please provide all fields" });
      }

      let existingUser = await user.findOne({ email });
      if (!existingUser) {
        logger.warn("User not found");
        return res.status(404).json({ message: "User not found" });
      }

      if (existingUser.role !== role) {
        logger.warn("Invalid role");
        return res.status(401).json({ message: "Invalid role" });
      }

      if (existingUser.isactive !== "active") {
        logger.warn("User is not active");
        return res.status(403).json({ message: "User is not active" });
      }

      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        logger.warn("Invalid password");
        return res.status(401).json({ message: "Invalid password" });
      }

      const accessToken = await AccessToken(existingUser._id);
      const refreshToken = await Refreshtoken(existingUser._id);
      await existingUser.updateOne({id: user._id},{
        lastLogin: new Date(),
      })

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      };

      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, cookieOptions);

      logger.info(`User logged in successfully`);
      res.status(201).json({
        message: `Welcome back, ${existingUser.fname}`,
        existingUser,
        success: true,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      logger.error(`Internal Server Error: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  update: async (req, res) => {
    try {
      const { fname, lname, email, phone, bio, skills, education, location, experience } = req.body;
      const userId = req.id;

      const existingUser = await user.findById(userId);
      if (!existingUser) {
        logger.warn("User not found");
        return res.status(404).json({ message: "User not found" });
      }

      let resumeUrl = null;
      let originalName = null;
      if (req.file) {
        const parser = getdatauri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(parser.content, {
          folder: "identify-service",
          public_id: existingUser.profile.resume ? existingUser.profile.resume.split('/').pop().split('.')[0] : undefined,
          overwrite: true,
        });
        resumeUrl = cloudResponse.secure_url;
        originalName = cloudResponse.original_filename;
      }

      let skillsArray = skills ? skills.split(",") : [];
      let educationArray = education ? education.split(",") : [];

      if (fname) existingUser.fname = fname;
      if (lname) existingUser.lname = lname;
      if (email) existingUser.email = email;
      if (phone) existingUser.phone = phone;
      if (bio) existingUser.profile.bio = bio;
      if (location) existingUser.profile.location = location;
      if (experience) existingUser.profile.experience = experience;
      if (skillsArray.length) existingUser.profile.skills = skillsArray;
      if (educationArray.length) existingUser.profile.education = educationArray;
      if (resumeUrl) existingUser.profile.resume = resumeUrl;
      if (originalName) existingUser.profile.originalName = originalName;

      await existingUser.save();
      return res.status(201).json({ message: "Profile updated successfully", existingUser, success: true });
    } catch (error) {
      logger.error(`Internal Server Error: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      logger.info(`User logged out successfully`);
      return res
        .status(201)
        .json({ message: "User logged out successfully", success: true });
    } catch (error) {
      logger.error(`internal server error `);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default userController;
