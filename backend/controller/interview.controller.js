import * as pdfParse from 'pdf-parse';
import {generateInterviewReport, generateResumePDF } from '../services/ai.services.js';
import interviewReportModel from '../model/InterviewReportmodel.js';

async function generateInterviewController(req,res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded. Please upload a resume." });
        }

        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        const {  jobDescription, selfDescription } = req.body; 
     
        const interviewReportByAI = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user._id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAI
        });

        res.status(201).json({
            message: "Interview report is generated successfully",
            interviewReport,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getInterviewReportById(req,res){
    try {
        const {interviewReportId} = req.params;
        const interviewReport = await interviewReportModel.findById(interviewReportId);
        if(!interviewReport){
            return res.status(404).json({
                message: "Interview report not found"
            })
        }
        res.status(200).json({
            message: "Interview report is fetched successfully",
            interviewReport
        })
    } catch (error) {
        res.status(500).json({  
            message: "Internal server error",
            error: error
        })
    }
}

   
async function getAllInterviewReports(req,res) {
    try {
       const interviewReports = await interviewReportModel
         .find({ user: req.user._id })
         .sort({ createdAt: -1 })
         .select("-resume -selfDescription -__v -technicalQuestions -behavioralQuestions -skillgap -preparationPlan");
       res.status(200).json({interviewReports}); 
    } catch (error) {
       res.status(500).json({     
            message: "Internal server error",
            error: error.message
       }) 
    }
}

async function generateResumePDFController(req,res) {
    const {interviewReportId} = req.params;
    const interviewReport = await interviewReportModel.findById(interviewReportId);
    if(!interviewReport){
        return res.status(404).json({
            message: "Interview report not found"
        })
    }

    const {resume,jobDescription, selfDescription} = interviewReport;
    const pdfBuffer = await generateResumePDF({resume, jobDescription, selfDescription});

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
    })
    res.send(pdfBuffer); 
}

export {generateInterviewController, getInterviewReportById, getAllInterviewReports, generateResumePDFController}


