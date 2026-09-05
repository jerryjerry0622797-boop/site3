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
        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
        const result = await model.generateContent(`You are an Instagram caption expert.
        Topic: "${prompt}"
        Generate exactly 5 short, viral,aesthetic,younique captions related to the topic above.
        Rules:
        1. Captions must be 100% related to "${prompt}"
        2. Style: short,aestheic,younique,Instagram-ready
        3. Number them 1. 2. 3. 4. 5.
        4. No extra text, no explanation`);
        const text = result.response.text();
        return NextResponse.json({ result: text });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "failed to generate captions" }, { status: 500 });
    }
}
