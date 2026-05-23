export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { handleApiError } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
    try {
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            return NextResponse.json({ error: "Google Gemini API Key not configured" }, { status: 500 });
        }

        const body = await req.json();
        const { messages, context } = body;

        const systemPrompt = `You are a helpful AI PDF assistant.
The user has provided one or more PDF documents.

${context ? `=== DOCUMENT CONTENT ===
The following is the complete text extracted from the user's PDF document. Study it carefully before answering any questions:

${context}
=== END OF DOCUMENT ===` : ''}

## IMPORTANT: Handling Greetings & Conversation
- **If the user says "hi", "hello", "thanks", "help", etc., YOU MUST RESPOND POLITELY.**
- Do NOT search the document for greetings. Just say hello back and offer help.
- Example: "Hello! I'm here to help you understand this document. What would you like to know?"

## SUPER IMPORTANT: Be "Extra Friendly" & Conversational 🌈
- **Personality**: You are a warm, intelligent, and super helpful assistant.
- **Tone**: Casual but professional. Use natural phrases like "Great question!", "Here's what I found,", "Interestingly,".
- **Engagement**: Talk *to* the user, not *at* them. Relate to their goal.
- **Micro-interactions**: Feel free to use simple emojis (🚀, 💡, ✨) to make the text feel alive.
- **Analogies**: Use simple real-world comparisons to explain difficult PDF concepts.

## Response Guidelines for Document Questions:
1. **Be Structured & Clean**: Use clear headings, bullet points, and tables.
2. **Use Tables**: MANDATORY for comparisons.
3. **Cite Pages**: \`[Page X]\` for every fact.
4. **Contextual**: For specific questions about the text, answer based ONLY on the provided document context.

## Formatting Standards:
- **Spacing**: Blank line between sections.
- **Tables**: For structure.
- **Citations**: \`[Page X]\` at end of sentences.

Base your **factual answers about the document** strictly on the content provided.`;

        let text: string;
        try {
            // Primary: Gemini 2.0 Flash (fast, capable, generous free tier)
            const result = await generateText({
                model: google('gemini-2.0-flash'),
                messages: messages.map((m: any) => ({
                    role: m.role,
                    content: m.content,
                })),
                system: systemPrompt,
                maxOutputTokens: 4000,
            });
            text = result.text;
        } catch (error: any) {
            console.warn("Gemini 2.0 Flash failed, trying fallback:", error.message);

            // Fallback: Gemini 2.0 Flash Lite (lighter, even more generous limits)
            const truncatedSystemPrompt = systemPrompt.length > 20000
                ? systemPrompt.substring(0, 5000) + "\n...(Context truncated for fallback mode)..."
                : systemPrompt;

            try {
                const result = await generateText({
                    model: google('gemini-2.0-flash-lite'),
                    messages: messages.map((m: any) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    system: truncatedSystemPrompt,
                    maxOutputTokens: 2000,
                });
                text = result.text;
            } catch (fallbackError: any) {
                console.error("Gemini fallback also failed:", fallbackError);
                throw error;
            }
        }

        return NextResponse.json({ role: 'assistant', content: text });

    } catch (error: any) {
        console.error("Chat API error:", error);

        // Handle rate limit / quota errors with a friendly message
        if (error?.statusCode === 429 || error?.lastError?.statusCode === 429 ||
            error?.message?.includes('RESOURCE_EXHAUSTED') || error?.message?.includes('quota')) {
            return NextResponse.json(
                { error: "AI service is temporarily busy. Please try again in a moment. ⏳" },
                { status: 429 }
            );
        }

        return handleApiError(error, "Internal server error during chat");
    }
}
