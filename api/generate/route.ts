export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
try {
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const { prompt } = await req.json() as { prompt: string };
        if (!prompt) {
            return NextResponse.json({ error: "prompt is required" }, { status: 400 });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
        const result = await model.generateContent(`Generate 5 funny and aesthetic captions for this topic: "$Pprompt}". Give only the captions, number 1 to 5.`);
        const text = result.response.text();
        return NextResponse.json({ result: text });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "failed to generate captions" }, { status: 500 });
    }
}    
