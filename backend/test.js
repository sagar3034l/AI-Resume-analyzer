async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}
        
        IMPORTANT: You must return the response in strict JSON format matching the provided schema.`;

    // 1. Convert targeting OpenAPI 3.0
    const rawSchema = zodToJsonSchema(interviewReportSchema, { target: "openApi3" });
    
    // 2. Strip the $schema key so Gemini doesn't reject it
    delete rawSchema.$schema;
    
    // 3. Fix the enum type issue if zod-to-json-schema omitted the type
    if (rawSchema.properties.skillGaps.items.properties.severity) {
        rawSchema.properties.skillGaps.items.properties.severity.type = "string";
    }

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            // 4. Pass the cleaned schema
            responseSchema: rawSchema,
        }
    });

    console.log(JSON.parse(response.text));
}



import { GoogleGenAI } from "@google/genai"
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}
        
        IMPORTANT: You must return the response in strict JSON format matching the provided schema.`;

    // 1. Convert targeting OpenAPI 3.0
    const rawSchema = zodToJsonSchema(interviewReportSchema, { target: "openApi3" });
    
    // 2. Explicitly reconstruct the schema to ensure we don't pass unexpected wrappers or $schema keys
    const finalSchema = {
        type: "object",
        properties: rawSchema.properties || {},
        required: rawSchema.required || [],
    };
    
    // 3. Fix the enum type issue safely using optional chaining (?.)
    // This prevents crashes if 'skillGaps' or 'severity' isn't nested exactly as expected
    if (finalSchema.properties?.skillGaps?.items?.properties?.severity) {
        finalSchema.properties.skillGaps.items.properties.severity.type = "string";
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Recommend using a standard public model like gemini-2.5-flash or gemini-1.5-flash
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                // 4. Pass the safely cleaned schema
                responseSchema: finalSchema,
            }
        });

        const jsonResponse = JSON.parse(response.text);
        console.log(jsonResponse);
        return jsonResponse;
        
    } catch (error) {
        console.error("AI Generation failed:", error);
        throw error;
    }
}

export default generateInterviewReport;