import { Queue, QueueEvents } from "bullmq";
import { bullmqConnection } from "../config/redis";

export interface GenerationJobData {
  assignmentId: string;
  teacherId: string;
  subject: string;
  className: string;
  questionTypes: Array<{
    type: string;
    numberOfQuestions: number;
    marksPerQuestion: number;
  }>;
  additionalInstructions?: string;
}

export interface PdfJobData {
  resultId: string;
  assignmentId: string;
  teacherId: string;
}

// ── Generation Queue ──
let generationQueue: Queue<GenerationJobData> | null = null;
let pdfQueue: Queue<PdfJobData> | null = null;

export function getGenerationQueue(): Queue<GenerationJobData> {
  if (!generationQueue) {
    generationQueue = new Queue<GenerationJobData>(
      process.env.GENERATION_QUEUE || "paper-generation",
      {
        connection: bullmqConnection,
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: "exponential", delay: 5000 },
          removeOnComplete: { count: 100 },
          removeOnFail: { count: 50 },
        },
      }
    );
    console.log("✅ Generation queue initialized");
  }
  return generationQueue;
}

export function getPdfQueue(): Queue<PdfJobData> {
  if (!pdfQueue) {
    pdfQueue = new Queue<PdfJobData>(
      process.env.PDF_QUEUE || "pdf-generation",
      {
        connection: bullmqConnection,
        defaultJobOptions: {
          attempts: 2,
          backoff: { type: "fixed", delay: 3000 },
          removeOnComplete: { count: 50 },
          removeOnFail: { count: 25 },
        },
      }
    );
    console.log("✅ PDF queue initialized");
  }
  return pdfQueue;
}

// Add a generation job to the queue
export async function enqueueGenerationJob(
  data: GenerationJobData
): Promise<string> {
  const queue = getGenerationQueue();
  const job = await queue.add("generate-paper", data, {
    priority: 1,
  });
  console.log(`📋 Generation job enqueued: ${job.id}`);
  return job.id!;
}

// Add a PDF job to the queue
export async function enqueuePdfJob(data: PdfJobData): Promise<string> {
  const queue = getPdfQueue();
  const job = await queue.add("generate-pdf", data, { priority: 2 });
  console.log(`📋 PDF job enqueued: ${job.id}`);
  return job.id!;
}

// Get job status from queue
export async function getJobStatus(jobId: string): Promise<{
  state: string;
  progress: number;
  result?: unknown;
  failedReason?: string;
} | null> {
  const queue = getGenerationQueue();
  const job = await queue.getJob(jobId);
  if (!job) return null;

  const state = await job.getState();
  return {
    state,
    progress: typeof job.progress === "number" ? job.progress : 0,
    result: job.returnvalue,
    failedReason: job.failedReason,
  };
}

// Graceful shutdown
export async function closeQueues(): Promise<void> {
  await Promise.all([
    generationQueue?.close(),
    pdfQueue?.close(),
  ]);
  console.log("Queues closed gracefully.");
}
