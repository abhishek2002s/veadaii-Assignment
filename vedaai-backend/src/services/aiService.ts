import Anthropic from "@anthropic-ai/sdk";
import { IQuestionType } from "../models/Assignment";
import { ISection } from "../models/GenerationResult";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GeneratedPaper {
  subject: string;
  className: string;
  timeAllowed: string;
  totalMarks: number;
  sections: ISection[];
  answerKey: string[];
  tokensUsed: number;
}

export interface GenerationInput {
  subject: string;
  className: string;
  questionTypes: IQuestionType[];
  additionalInstructions?: string;
}

function buildPrompt(input: GenerationInput): string {
  const { subject, className, questionTypes, additionalInstructions } = input;
  const totalMarks = questionTypes.reduce(
    (s, qt) => s + qt.numberOfQuestions * qt.marksPerQuestion, 0
  );
  const timeMinutes = Math.max(30, Math.round(totalMarks * 1.5));

  const requirementsList = questionTypes
    .map(
      (qt, i) =>
        `Section ${String.fromCharCode(65 + i)}: ${qt.type} — ${qt.numberOfQuestions} question(s) × ${qt.marksPerQuestion} mark(s) each`
    )
    .join("\n");

  return `You are an expert CBSE exam paper creator. Generate a structured ${subject} exam paper for Class ${className} students.

REQUIREMENTS:
${requirementsList}
Total Marks: ${totalMarks}
Time: ${timeMinutes} minutes
${additionalInstructions ? `Special Instructions: ${additionalInstructions}` : ""}

STRICT RULES:
1. Return ONLY valid JSON — no markdown, no extra text, no code fences
2. Questions must be educationally sound and age-appropriate for Class ${className}
3. Distribute difficulty: roughly 40% Easy, 40% Moderate, 20% Hard
4. MCQ options must have exactly 4 plausible choices
5. answerKey array must have one entry per question, in order across all sections
6. Do NOT include the answer inside the question text

OUTPUT FORMAT (strict JSON):
{
  "subject": "${subject}",
  "className": "${className}",
  "timeAllowed": "${timeMinutes} minutes",
  "totalMarks": ${totalMarks},
  "sections": [
    {
      "name": "A",
      "title": "Multiple Choice Questions",
      "instruction": "Attempt all questions. Each question carries 1 mark.",
      "questions": [
        {
          "number": 1,
          "text": "Question text here?",
          "difficulty": "Easy",
          "marks": 1,
          "options": ["Option A", "Option B", "Option C", "Option D"]
        }
      ]
    }
  ],
  "answerKey": [
    "Answer to Q1: ...",
    "Answer to Q2: ..."
  ]
}

Topic focus for ${subject} Class ${className}: Use curriculum-aligned NCERT topics.`;
}

export async function generateQuestionPaper(
  input: GenerationInput
): Promise<GeneratedPaper> {
  const prompt = buildPrompt(input);

  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText =
    response.content.find((b) => b.type === "text")?.text || "";

  // Strip any accidental markdown fences
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```$/m, "")
    .trim();

  let parsed: Omit<GeneratedPaper, "tokensUsed">;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("AI response parse failed. Raw:", rawText.slice(0, 500));
    throw new Error(`Failed to parse AI response as JSON: ${(err as Error).message}`);
  }

  // Validate structure
  if (!parsed.sections || !Array.isArray(parsed.sections)) {
    throw new Error("AI response missing sections array");
  }
  if (!parsed.answerKey || !Array.isArray(parsed.answerKey)) {
    throw new Error("AI response missing answerKey array");
  }

  return {
    ...parsed,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
  };
}
