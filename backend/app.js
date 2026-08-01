import express from 'express'
import router from './routes/route.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './lib/db.js';
import interviewRouter from './routes/interviewRoute.js';

dotenv.config();
const app = express();

app.use(cookieParser())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

app.use(express.json())
app.use("/api/auth", router);
app.use("/api/interview",interviewRouter)

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server listen in port ${process.env.PORT || 3000}`)
})
