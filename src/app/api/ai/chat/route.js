import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const systemMessage = {
      role: "system",
      content:
        "You are an expert AI study assistant helping students. You can help with study planning, concept explanations, doubt solving, and study tips. Be clear, concise, and encouraging. Use markdown for formatting.",
    };

    const completion = await groq.chat.completions.create({
      messages: [systemMessage, ...messages],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "I apologize, but I was unable to process that request.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply: "Sorry, I encountered an error. Please try again.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
