

import { Request, Response } from 'express';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';
import { handleApiError } from '../lib/api-utils.js';

// Configure OpenRouter
const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    headers: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "PDF Chat",
    }
});

export const postHandler = async (req: Request, res: Response) => {
    try {
        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({ error: "OpenRouter API Key not configured" });
        }

        const body = req.body;
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
            // Attempt 1: Standard Auto Mode
            const result = await generateText({
                model: openrouter('openrouter/auto'),
                messages: messages.map((m: any) => ({
                    role: m.role,
                    content: m.content,
                })),
                system: systemPrompt,
                // @ts-ignore
                maxTokens: 4000,
            });
            text = result.text;
        } catch (error: any) {
            console.warn("Standard chat failed, executing fallback:", error.message);

            // Attempt 2: Free Model with Truncated Context
            const truncatedSystemPrompt = systemPrompt.length > 20000
                ? systemPrompt.substring(0, 5000) + "\n...(Context truncated for budget mode)..."
                : systemPrompt;

            try {
                const result = await generateText({
                    model: openrouter('arcee-ai/trinity-large-preview:free'),
                    messages: messages.map((m: any) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    system: truncatedSystemPrompt,
                    // @ts-ignore
                    maxTokens: 500,
                });
                text = result.text;
            } catch (fallbackError: any) {
                console.error("Chat fallback failed:", fallbackError);
                throw error;
            }
        }

        return res.json({ role: 'assistant', content: text });

    } catch (error) {
        return handleApiError(res, error, "Internal server error during chat");
    }
}
