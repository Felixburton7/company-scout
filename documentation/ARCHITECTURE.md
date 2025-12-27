# System Architecture: Company Scout

This project is a high-performance **AI Sales Agent** prototype, mirroring the tech stack used in modern **AI applications**.

## 1. The Components & How They Link

### **Frontend & API (Next.js + tRPC)**
- **What it does:** The user interface where you input a company domain (e.g., `openai.com`).
- **Flow:** When you click "Analyze", it calls a type-safe **tRPC** endpoint (`company.analyze`).
- **Action:** This endpoint does two things:
  1. Creates a "researching" record in **SingleStore**.
  2. Offloads the heavy lifting to **Trigger.dev**.

### **The Database (SingleStore + Drizzle ORM)**
- **Why SingleStore?** It's a high-performance, distributed SQL database optimized for data-intensive applications. It handles the "millions of raw records" mentioned in the job description much faster than traditional DBs.
- **Link:** We use **Drizzle ORM** to interact with SingleStore in a type-safe way (no raw SQL queries).

### **The Brain / Orchestration (Trigger.dev)**
- **What it does:** This is the "Agent" layer. It creates long-running background jobs that don't block your website.
- **The "Scout" Task:**
  1. Receives the `domain` from the API.
  2. **AI Enrichment:** Calls an LLM (like OpenAI) to research the company, categorize it, and find leads.
  3. **Updates:** Writes the final detailed results back to **SingleStore**.

## 2. Where AI Fits In
- The **AI** lives inside the **Trigger.dev tasks**.
- Instead of making your user wait 30 seconds for ChatGPT to answer, the request is sent to the background.
- The Agent can perform multiple steps: "Search web" -> "Read website" -> "Summarize" -> "Save to DB".

## 3. What is MCP? (Model Context Protocol)
- **You have it installed.** We just set it up in your `.gemini/settings.json`.
- **Function:** It acts as a bridge between your **AI Editor** (Cursor/Windsurf/Gemini) and your **Dev Tools** (Trigger.dev).
- **Benefit:** It allows the AI you are coding with to *read* your Trigger.dev status, *see* failed runs, and *debug* remote jobs directly without you copy-pasting errors.

---

## Data Flow Summary
`User` -> `Next.js UI` -> `tRPC API` -> `SingleStore (Create Record)` -> `Trigger.dev (AI Agent)` -> `SingleStore (Update Result)` -> `User (See Dashboard)`
