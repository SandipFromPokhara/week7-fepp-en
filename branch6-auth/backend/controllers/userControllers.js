const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

// Generate JWT
const generateToken = (_id) => {
    return jwt.sign( { _id }, process.env.SECRET, { expiresIn: "3d",
    });
};

const signupUser = async (req, res) => {
    const { name, email, password, phone_number, gender, date_of_birth, membership_status} = req.body;

    try {
        if (!name || !email || !password || !phone_number || !gender || !date_of_birth || !membership_status) {
            res.status(400);
            throw new Error("All fields are required!");
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }

        if (!validator.isAlpha(name)) throw new Error("Name format is not valid");
        if (!validator.isEmail(email)) throw new Error("Email format is not valid");

        if (!validator.isStrongPassword(password)) throw new Error("Password is not strong");

        if(!validator.isNumeric(phone_number)) throw new Error("Invalid phone number"); 

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone_number,
            gender,
            date_of_birth,
            membership_status,
        });

        if (user) {
            const token = generateToken(user._id);
            res.status(201).json({ email, token });
        } else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))){
            const token = generateToken(user._id);
            res.status(200).json({ email, token });
        } else {
            res.status(400);
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        res.status(400).json({ error: error-message });
    }
};

const getMe = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    signupUser, loginUser, getMe
};