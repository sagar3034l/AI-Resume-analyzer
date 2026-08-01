import express from 'express'
import { protect } from '../authmiddleware/middleware.js';
import {upload} from '../authmiddleware/file.middleware.js'
import { generateInterviewController, generateResumePDFController, getAllInterviewReports, getInterviewReportById } from '../controller/interview.controller.js';

const interviewRouter = express.Router();

interviewRouter.post("/generate",protect,upload.single("resume"),generateInterviewController)
interviewRouter.get("/all-reports", protect, getAllInterviewReports)
interviewRouter.get("/:interviewReportId",protect,getInterviewReportById)
interviewRouter.post("/resume/pdf/:interviewReportId",protect, generateResumePDFController)


export default interviewRouter; 

 
