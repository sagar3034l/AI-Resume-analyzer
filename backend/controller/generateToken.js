import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

export const generateToken = (res, userId)=>{
    const token = jwt.sign({userId:userId},process.env.JWT_SECRET,{
        expiresIn:'7d'
    });
    res.cookie("token",token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7*24*60*60*1000,
    })
}
