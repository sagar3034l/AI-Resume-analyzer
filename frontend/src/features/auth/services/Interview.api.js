import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function generateInterview({jobDescription, selfDescription, resumeFile}) {
    try {
        const formData = new FormData()
        formData.append("jobDescription", jobDescription)
        formData.append("selfDescription", selfDescription)
        formData.append("resume", resumeFile)
        const res = await api.post("/api/interview/generate", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {   
        return error.response?.data || { message: error.error };
    }
}

export async function getInterviewById(interviewId) {
    try {
        const res = await api.get(`/api/interview/${interviewId}`);
        return res.data;
    } catch (error) {
        return error.response?.data || { message: error.error };
    }
}

export async function getAllInterviewReports() {
    try {
        const res = await api.get("/api/interview/all-reports");
        return res.data?.interviewReports || [];
    } catch (error) {
        return error.response?.data || { message: error.message };
    }
}

export const generateResumePdf = async ({interviewReportId}) => {
    try {
        const res = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
            responseType: "blob",
        });
        return res.data;
    } catch (error) {
        return error.response?.data || { message: error.message };
    }
}

