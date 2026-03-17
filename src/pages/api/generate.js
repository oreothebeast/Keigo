import { generateAiPrompt } from "../../utils/prompt";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { type, level, userContent, isChecked } = req.body;
    const fullPrompt = generateAiPrompt(type, level, userContent, isChecked);

    try {
        // We use v1beta for the latest Gemini 3 models or v1 for stable 2.5
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: fullPrompt }] }]
                }),
            }
        );

        const data = await response.json();

        // Check if the API returned an error message
        if (data.error) {
            console.error("GOOGLE ERROR:", data.error.message);
            return res.status(500).json({ error: data.error.message });
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            res.status(200).json({ result: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: 'Gemini returned an empty response' });
        }
    } catch (error) {
        console.error("SERVER CRASH:", error);
        res.status(500).json({ error: 'Failed to connect to Gemini' });
    }
}