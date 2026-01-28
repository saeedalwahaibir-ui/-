
import { GoogleGenAI, Type } from "@google/genai";
import { Grade, Semester } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudySchedule = async (
  grade: Grade, 
  semester: Semester, 
  subjects: string[], 
  availableHours: number, 
  startTime: string = "16:00"
) => {
  const prompt = `قم بتوليد جدول مذاكرة يومي مفصل وشامل لجميع المواد التالية: ${subjects.join(', ')}. 
       الطالب في الصف ${grade} (${semester}) في سلطنة عمان لعام 2026. 
       لديه ${availableHours} ساعات اليوم. ابدأ من الساعة ${startTime}. 
       وزع الوقت بعدل على كل المواد بحيث يغطي الجدول يوماً واحداً كاملاً بكل المواد الأساسية. 
       لا تذكر أسماء دروس محددة، بل اذكر نوع النشاط (مراجعة، تمارين، تحضير، حل أسئلة كتاب).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING, description: "اسم اليوم أو 'خطة اليوم'" },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  subject: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  duration: { type: Type.NUMBER },
                  time: { type: Type.STRING },
                  isPriority: { type: Type.BOOLEAN }
                },
                required: ["subject", "topic", "duration", "time"]
              }
            }
          },
          required: ["day", "tasks"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const summarizeContent = async (text: string, grade: Grade, semester: Semester, subject?: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `أنت خبير تعليمي متخصص في المنهج العماني المعتمد لعام 2026. 
    المطلوب: تلخيص المحتوى التعليمي التالي لطالب في الصف ${grade} (${semester}).
    ${subject ? `المادة المستهدفة: ${subject}.` : ''}
    
    شروط التلخيص:
    1. التركيز على مخرجات التعلم المعتمدة في سلطنة عمان.
    2. استخراج التعريفات والمصطلحات الأساسية بدقة.
    3. إذا كان المحتوى علمياً، استخرج القوانين والعلاقات.
    
    المحتوى:
    ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          keyPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "content", "keyPoints"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateInteractiveQuiz = async (summaryText: string, grade: Grade, subject?: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `بناءً على التلخيص التالي لمادة ${subject || 'دراسية'} للصف ${grade} في المنهج العماني، قم بإنشاء اختبار تفاعلي مكون من 5 أسئلة اختيار من متعدد.
    
    التلخيص:
    ${summaryText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswerIndex: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const summarizeFile = async (base64Data: string, mimeType: string, grade: Grade, semester: Semester) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: mimeType } },
        { text: `قم بتحليل وتلخيص هذا الملف التعليمي بناءً على معايير المنهج العماني 2026 للصف ${grade} (${semester}). استخرج أهم المفاهيم والقوانين والتعاريف والرسومات التوضيحية المشروحة.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          keyPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "content", "keyPoints"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getCurriculumOutline = async (grade: Grade, semester: Semester, subject: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `أعطني هيكلاً عاماً للوحدات الدراسية لمادة ${subject} للصف ${grade} (${semester}) لعام 2026 في سلطنة عمان.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          keyPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "content", "keyPoints"]
      }
    }
  });

  return JSON.parse(response.text);
};
