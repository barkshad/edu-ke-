import { GoogleGenAI } from "@google/genai";
import { Student, ExamResult } from "../types";
import { SUBJECTS } from "../constants";

// Using process.env.API_KEY as strictly required
const apiKey = process.env.API_KEY;

// Safe initialization
const getAI = () => {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateStudentInsights = async (student: Student, results: ExamResult[]) => {
  const ai = getAI();
  if (!ai) {
    return "AI Insights require an API Key. (Demo mode: Student is performing well in Sciences but needs improvement in Languages.)";
  }

  // Format data for the prompt
  const performanceSummary = results.map(r => {
    const sub = SUBJECTS.find(s => s.id === r.subjectId);
    return `${sub?.name || r.subjectId}: ${r.score}% (${r.grade})`;
  }).join('\n');

  const prompt = `
    You are an expert educational analyst for the Kenyan school system.
    Analyze the following student performance data and provide:
    1. A brief summary of academic standing.
    2. Three specific actionable insights.
    3. One key recommendation for improvement.

    Student: ${student.name} (${student.stream})
    Attendance: ${student.attendanceRate}%
    
    Results:
    ${performanceSummary}

    Format the response in clean HTML with <strong> tags for emphasis. Keep it encouraging but professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insights at this time. Please check internet connection.";
  }
};

export const generateClassInsights = async (className: string, average: number, weakSubject: string, strongSubject: string) => {
  const ai = getAI();
  if (!ai) return "AI Insights unavailable (Missing API Key).";

  const prompt = `
    Provide a short executive summary for a class teacher regarding class performance.
    Class: ${className}
    Average Score: ${average}%
    Strongest Subject: ${strongSubject}
    Weakest Subject: ${weakSubject}

    Suggest 2 teaching strategies to improve the weak subject.
  `;

   try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Unable to generate class insights.";
  }
};
