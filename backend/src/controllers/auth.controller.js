import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();

        return { accessToken, refreshToken };
    } catch (error) {
        return {
            error: "Something went wrong while generating refresh and access tokens",
            statusCode: 500,
        };
    }
};

const registerUser = async (req, res) => {
    const { email, name, password } = req.body;

    if (
        [email, name, password].some((field) => !field || field.trim() === "")
    ) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        return res.status(409).json({ error: "User already exist" });
    }

    const user = await User.create({
        name,
        email,
        password,
        authMethod: "email",
    });

    const createdUser = await User.findById(user._id);
    if (!createdUser) {
        return res
            .status(500)
            .json({ error: "Something went wrong while registering the user" });
    }

    return res.status(201).json({ message: "User created successfully" });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({ error: "User data not exists" });
        }

        if (!user.password) {
            return res.status(401).json({ error: "Invalid user credentials" });
        }

        const ispasswordvalid = await user.isPasswordCorrect(password);

        if (!ispasswordvalid) {
            return res.status(401).json({ error: "Invalid user credentials" });
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "User logged in successfully",
                loggedInUser,
                accessToken,
                refreshToken,
            });
    }
    return res.status(400).json({ error: "Invalid Login request" });
};

const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    );
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ message: "User logged out successfully" });
};

export { registerUser, loginUser, logoutUser, generateAccessAndRefreshTokens };
