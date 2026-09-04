import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
async function safeGenerate(genAI, prompt) {
    const models = ["gemini-3.6-flash", "gemini-1.5-flash-8b"];
    for (let i = 0; i < models.length; i++) {
        const model = genAI.getGenerativeModel({model: models[i] });
        try {
            const result = await model.generateContent(prompt);
            return await result.response.text();
        } catch (error) {
            if (error.status === 503 && i === 0) {
                await new Promise(r => setTimeout(r, 2000));
                try {
                    const result = await model.generateContent(prompt);
                    return await result.response.text();
    } catch {}
}
if (i === models.length - 1) throw error;
        }
    }
}
export async function POST(request) {
    try {
        const { prompt } = await request.json();
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "API Key nahi mili" }, { status: 500});
        }
        const promptText = `Write 5 short viral and captions for:${prompt}. Number them 1. to 5. ADD 2-3 hashtags in each.`;
        const text = await safeGenerate(genAI, promptText);
    return NextResponse.json({ result: text });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error:"kuch ghalat ho gaya" }, { status: 500});
    }
}
