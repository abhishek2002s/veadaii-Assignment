"use client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiClient {
  constructor() {
    this.token =
      typeof window !== "undefined"
        ? localStorage.getItem("vedaai_token")
        : null;
  }

  setToken(token) {
    this.token = token;
    if (token) localStorage.setItem("vedaai_token", token);
    else localStorage.removeItem("vedaai_token");
  }

  async fetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  // Auth
  async login(email, password) {
    const res = await this.fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.data.token);
    return res.data;
  }

  async register(data) {
    const res = await this.fetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setToken(res.data.token);
    return res.data;
  }

  async getMe() {
    return this.fetch("/auth/me");
  }

  // Assignments
  async listAssignments() {
    return this.fetch("/api/assignments");
  }

  async createAssignment(data) {
    return this.fetch("/api/assignments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getAssignmentStatus(id) {
    return this.fetch(`/api/assignments/${id}/status`);
  }

  async getAssignmentResult(id) {
    return this.fetch(`/api/assignments/${id}/result`);
  }
}

export const api = new ApiClient();

// Keep these for fallback and compatibility with older mock-based code
export function getFallback(questionTypes) {
  let num = 1;
  const sampleQ = {
    "Multiple Choice Questions": [
      "During electroplating, the object to be plated is connected to which terminal?",
      "Which substance is NOT a conductor?",
      "Electrolysis of brine produces?",
      "Which current is used in electroplating?",
    ],
    "Short Questions": [
      "Define electroplating and explain its purpose.",
      "What is the role of a conductor in electrolysis?",
      "Why does copper sulfate solution conduct electricity?",
      "Describe one chemical effect of electric current.",
    ],
    "Long Answer Questions": [
      "Explain electroplating with a diagram. Mention three applications.",
      "Describe brine electrolysis with all chemical reactions.",
    ],
    "Diagram/Graph-Based Questions": [
      "Draw a labelled diagram of the electrolytic cell for electroplating.",
      "Draw a circuit to detect if a liquid conducts electricity.",
    ],
    "Numerical Problems": [
      "A current of 2A flows for 30 min. Calculate charge passed.",
      "If 0.32g copper deposits for 965C, find the electrochemical equivalent.",
    ],
    "True/False": [
      "Electroplating uses alternating current. (True/False)",
      "Pure water is a good conductor of electricity. (True/False)",
    ],
    "Fill in the Blanks": [
      "The process of depositing a metal using electricity is called ______.",
      "In electrolysis, cations move towards the ______.",
    ],
  };
  const sections = questionTypes.map((qt, si) => ({
    name: String.fromCharCode(65 + si),
    title: qt.type,
    instruction: `Attempt all questions. Each question carries ${qt.marks} mark(s).`,
    questions: Array.from({ length: qt.questions }, (_, i) => {
      const list = sampleQ[qt.type] || sampleQ["Short Questions"];
      const q = {
        number: num++,
        text: list[i % list.length],
        difficulty: ["Easy", "Moderate", "Hard"][i % 3],
        marks: qt.marks,
      };
      if (qt.type === "Multiple Choice Questions")
        q.options = [
          "Negative terminal (cathode)",
          "Positive terminal (anode)",
          "Either terminal",
          "None of the above",
        ];
      return q;
    }),
  }));
  return {
    subject: "Science",
    class: "9th",
    time: "45 minutes",
    totalMarks: questionTypes.reduce((s, q) => s + q.questions * q.marks, 0),
    sections,
    answerKey: [
      "Electroplating deposits a thin metal layer using electric current to prevent corrosion and improve appearance.",
      "A conductor allows current flow, enabling ions to move and cause chemical changes at electrodes.",
      "Copper sulfate contains free Cu²⁺ and SO₄²⁻ ions that carry charge, enabling conduction.",
      "Electroplating of silver on jewellery prevents tarnishing.",
      "Electric current causes ion movement leading to chemical changes at electrodes.",
    ],
  };
}

export async function generatePaper(config) {
  // Try real API, fallback if it fails
  try {
    const res = await api.createAssignment({
      title: "AI Generated Paper",
      subject: config.subject || "Science",
      className: config.className || "9th",
      dueDate: config.dueDate,
      questionTypes: config.questionTypes.map((q) => ({
        type: q.type,
        numberOfQuestions: q.questions,
        marksPerQuestion: q.marks,
      })),
      additionalInstructions: config.instructions,
    });

    // Polling status
    let status = res.data.status;
    let assignmentId = res.data.assignment.id;

    while (status === "generating") {
      await new Promise((r) => setTimeout(r, 2000));
      const sRes = await api.getAssignmentStatus(assignmentId);
      status = sRes.data.status;
    }

    if (status === "ready") {
      const resultRes = await api.getAssignmentResult(assignmentId);
      return resultRes.data;
    }

    throw new Error("Generation failed on backend");
  } catch (err) {
    console.warn("Backend API failed, using fallback:", err.message);
    await new Promise((r) => setTimeout(r, 4000));
    return getFallback(config.questionTypes);
  }
}
