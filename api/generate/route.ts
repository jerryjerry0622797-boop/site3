import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const prompt: string = body.prompt;
        if (!prompt) {
            return NextResponse.json({ error: "prompt is required" }, { status: 400 });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
        const result = await model.generateConentent(`Generate 5 funny and aesthetic captions for this topic: "$Pprompt}". Give only the captions, number 1 to 5.`);
        const response = await result.response:
        const text = response.text();
        return NextResponse.json({ result: text });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(errorMessage);
        return NextResponse.json({ error: "failed to generate captions" }, { status: 500 });
    }
}    
