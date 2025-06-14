import nodemailer from 'nodemailer';
import jsonwebtoken from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv()
const jwt = jsonwebtoken;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.VERIFICATION_EMAIL,
        pass: process.env.VERIFICATION_PASS
    }
});



const mailOptions = (receiverEmail) => {
    const token = jwt.sign(
    {receiverEmail},
    process.env.VERIFICATION_TOKEN,
    {expiresIn: "24h"}
);
    return {
  from: process.env.VERIFICATION_EMAIL,
  to: receiverEmail,
  subject: "Verify Your Email - TelaStudio",
  html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6fb; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background-color: #ffffff; padding: 10px; border-radius: 12px; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center;">
                <h2 style="color: #191971; margin-bottom: 10px;">Ricetta</h2>
                <p style="color: #333333; font-size: 16px; line-height: 1.6;">
                    Thank you for signing up. Please verify your email address.
                </p>
            </div>

            <div style="text-align: center; margin: 10px 0;">
                <a href="http://ricettapp.netlify.app/signin/${token}" 
                    style="display: inline-block; background-color: #191971; color: #ffffff; text-decoration: none; padding: 14px 26px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                    Verify Email
                </a>
            </div>

            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0 3px;">

            <footer style="text-align: center; color: #999999; font-size: 13px;">
                &copy; 2025 Ricetta. All rights reserved.
            </footer>
        </div>
    </div>
    `,
};

}

const verifyEmail = (receiverEmail) => {
    transporter.sendMail(mailOptions(receiverEmail), (err, info) => {
        if(err){
            console.log(err.message);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
}

export default verifyEmail;