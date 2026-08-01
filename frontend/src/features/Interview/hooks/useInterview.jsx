import { useCallback, useContext } from "react";
import { getAllInterviewReports, generateInterview, getInterviewById, generateResumePdf } from "../../auth/services/Interview.api";
import { interviewContext } from "../Interview.context";

export const useInterview = () => {
    const context = useContext(interviewContext);

    if (!context) {
        throw new Error("useInterview must be used within an interviewProvider");
    }

    const { loading, report, setLoading, setReport, reports, setReports } = context;
    const generateReport = useCallback(async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        let response;
        try {
            response = await generateInterview({ jobDescription, selfDescription, resumeFile });
            setReport(response?.interviewReport)
        } catch (error) {
            console.error("Error is ",error)
        } finally {
            setLoading(false)
        }

        return response?.interviewReport;
    }, [setLoading, setReport]);

    const getReportById = useCallback(async (interviewId) => {
        setLoading(true);
        let response = null
        try {
            response = await getInterviewById(interviewId);
            setReport(response?.interviewReport);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }

        return response?.interviewReport;
    }, [setLoading, setReport]);

   const getAllReports = useCallback(async () => {
        setLoading(true);
        let response = null
        try {
            response = await getAllInterviewReports();
            setReports(response || []);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }

        return response;
    }, [setLoading, setReports]);

    const getResumePdf = async (interviewReportId)=>{
        setLoading(true);
        let response = null;
        try {
            response = await generateResumePdf({interviewReportId})
            const blob = response instanceof Blob
                ? response
                : new Blob([response], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url
            link.setAttribute("download",`resume_${interviewReportId}.pdf`)
            document.body.appendChild(link);
            link.click()
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false)
        }
    }

    return { loading, report, reports, generateReport, getReportById, getAllReports,getResumePdf}
}




// Here’s a shorter resume version that still covers the main features:

// - Built an AI-powered resume analyzer that accepts PDF resumes, extracts text, and generates personalized interview reports based on the candidate profile and job description.
// - Integrated Google Gemini with schema-validated outputs to deliver match scores, technical and behavioral interview questions, skill-gap analysis, and a day-wise preparation roadmap.
// - Developed a secure backend with authenticated REST APIs to generate, store, retrieve, and manage interview reports in MongoDB.
// - Added PDF resume generation using HTML-to-PDF conversion with Puppeteer, allowing users to download a tailored resume version.
// - Created a React dashboard to display interview insights with interactive question cards, skill-gap tags, and progress-style match scoring.

// If you want, I can also make it:
// 1. even shorter for 1-line project mention, or  
// 2. more professional and ATS-friendly for a resume.