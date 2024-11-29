import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

export const sendVerificationCode = async (email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const code = Math.floor(100000 + Math.random() * 900000);
      await transporter.sendMail({
          from: "hustle inc",
          to: `${email}`,
          subject: "Verification Code",
          text: `Your Verification Code is ${code}`,
      });
      
      const verificationCode = jwt.sign({code}, process.env.JWT_SECRET, {
        expiresIn: 30000
      });

      return verificationCode;
}