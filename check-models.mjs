import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // For some reason the Node SDK might not expose listModels directly on genAI instance easily or it's on the client.
    // Actually it is not direct.
    // Let's just try to generate content with gemini-pro to see if it works.

    try {
        console.log("Trying gemini-1.5-flash...");
        const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        await model1.generateContent("Hello");
        console.log("gemini-1.5-flash worked!");
    } catch (e) {
        console.log("gemini-1.5-flash failed:", e.message);
    }

    try {
        console.log("Trying gemini-pro...");
        const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
        await model2.generateContent("Hello");
        console.log("gemini-pro worked!");
    } catch (e) {
        console.log("gemini-pro failed:", e.message);
    }
}

listModels();
