import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateReleaseNotes(input: {
  commits?: string[];
  prTitles?: string[];
  manualNotes?: string;
  productName?: string;
}): Promise<string> {
  const prompt = `You are a technical writer for a SaaS product. Generate clean, user-friendly release notes based on the following inputs.

Product: ${input.productName || "Our Product"}

${input.commits?.length ? `Git commits:\n${input.commits.join("\n")}` : ""}
${input.prTitles?.length ? `Pull request titles:\n${input.prTitles.join("\n")}` : ""}
${input.manualNotes ? `Manual notes:\n${input.manualNotes}` : ""}

Generate a structured changelog entry with:
- A brief summary headline
- Bug fixes section (if any)
- New features section (if any)  
- Improvements section (if any)
- Use clear, non-technical language
- Format as markdown`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 800,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "";
}

export async function clusterFeedback(feedbackItems: Array<{ title: string; description?: string | null; voteCount: number }>) {
  const feedbackText = feedbackItems
    .map((f, i) => `${i + 1}. "${f.title}" (${f.voteCount} votes)`)
    .join("\n");

  const prompt = `Analyze these user feedback items and group them into clusters of similar requests. Return JSON only.

Feedback items:
${feedbackText}

Return this exact JSON structure:
{
  "clusters": [
    {
      "theme": "theme name",
      "items": [1, 3, 7],
      "totalVotes": 45,
      "summary": "brief summary"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1000,
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  try {
    return JSON.parse(response.choices[0]?.message?.content || "{}");
  } catch {
    return { clusters: [] };
  }
}

export async function generateChangelogSummary(rawContent: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "user",
      content: `Summarize this changelog entry into a 1-2 sentence highlight for an email notification:\n\n${rawContent}`,
    }],
    max_tokens: 150,
    temperature: 0.5,
  });

  return response.choices[0]?.message?.content || rawContent.slice(0, 200);
}
