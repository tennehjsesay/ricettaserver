import Users from "../models/Users.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import verifyEmail from "../services/verifyEmail.js";
const jwt = jsonwebtoken;

const authController = {
    signup: async (req, res) => {
        const {firstname, lastname, email, password} = req.body;
        if(!firstname) return res.status(400).json({"message": "Firstname is required!"});
        if(!lastname) return res.status(400).json({"message": "Lastname is required!"});
        if(!email) return res.status(400).json({"message": "Email is required!"});
        if(!password) return res.status(400).json({"message": "Password is required!"});
        const duplicate = await Users.findOne({email});
        if(duplicate) return res.status(409).json({"message": "Account with email already exists!"});
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await Users.create({firstname, lastname, email, password: hashedPassword, profilephoto: ""});
        if (result) verifyEmail(email);
        res.status(201).json({"message": "User successfully created!"});
    },
    signin: async (req, res) => {
        const {email, password} = req.body;
        if(!email) return res.status(400).json({"message": "Email is required!"});
        if(!password) return res.status(400).json({"message": "Password is required!"});
        const user = await Users.findOne({email});
        if(!user) return res.status(403).json({"message": "Email doesn't exist!"});
        const correctPassword = await bcrypt.compare(password, user.password);
        if(!correctPassword) return res.status(401).json({"message": "Incorrect password!"});
        if(!user.verified) return res.status(401).json({"message": "Check your email to verify!"});
        const UserInfo = {firstname: user.firstname, lastname: user.lastname, email: user.email, roles: user.roles, id: user._id}
        const accessToken = jwt.sign(
            UserInfo,
            process.env.ACCESS_TOKEN,
            {expiresIn: "30m"}
        );
        const refreshToken = jwt.sign(
            UserInfo,
            process.env.REFRESH_TOKEN,
            {expiresIn: "1d"}
        );
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie("refreshToken", refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
        res.json({token: accessToken, user: UserInfo});
        // res.send("This is the login controller");
    }
}

export default authController;