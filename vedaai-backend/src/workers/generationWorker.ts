import "dotenv/config";
import { Worker, Job } from "bullmq";
import { bullmqConnection } from "../config/redis";
import { connectDatabase } from "../config/database";
import { GenerationJobData } from "../services/queueService";
import { generateQuestionPaper } from "../services/aiService";
import { Assignment } from "../models/Assignment";
import { GenerationResult } from "../models/GenerationResult";
import { emitJobEvent } from "../config/websocket";

// NOTE: In a real deployment this worker runs as a separate process:
//   npm run worker
// It can also run in-process for development (imported in index.ts).

async function processGenerationJob(job: Job<GenerationJobData>): Promise<void> {
  const { assignmentId, subject, className, questionTypes, additionalInstructions } = job.data;

  console.log(`⚙️  Processing generation job ${job.id} for assignment ${assignmentId}`);

  // 1. Mark assignment as generating
  await Assignment.findByIdAndUpdate(assignmentId, {
    status: "generating",
    jobId: job.id,
  });

  emitJobEvent(job.id!, {
    type: "JOB_STARTED",
    jobId: job.id!,
    message: "AI generation started",
    progress: 5,
  });

  await job.updateProgress(10);

  // 2. Call Anthropic AI
  emitJobEvent(job.id!, {
    type: "JOB_PROGRESS",
    jobId: job.id!,
    message: "Generating questions with AI...",
    progress: 30,
  });

  await job.updateProgress(30);

  let generated;
  try {
    generated = await generateQuestionPaper({
      subject,
      className,
      questionTypes,
      additionalInstructions,
    });
  } catch (err) {
    console.error(`❌ AI generation failed for job ${job.id}:`, err);

    await Assignment.findByIdAndUpdate(assignmentId, { status: "failed" });

    emitJobEvent(job.id!, {
      type: "JOB_FAILED",
      jobId: job.id!,
      message: `AI generation failed: ${(err as Error).message}`,
      progress: 0,
    });

    throw err;
  }

  await job.updateProgress(70);

  emitJobEvent(job.id!, {
    type: "JOB_PROGRESS",
    jobId: job.id!,
    message: "Saving generated paper...",
    progress: 80,
  });

  // 3. Save result to MongoDB
  const result = await GenerationResult.create({
    assignmentId,
    jobId: job.id,
    subject: generated.subject,
    className: generated.className,
    timeAllowed: generated.timeAllowed,
    totalMarks: generated.totalMarks,
    sections: generated.sections,
    answerKey: generated.answerKey,
    tokensUsed: generated.tokensUsed,
    generatedAt: new Date(),
  });

  // 4. Update assignment to ready
  await Assignment.findByIdAndUpdate(assignmentId, {
    status: "ready",
    resultId: result._id,
  });

  await job.updateProgress(100);

  // 5. Notify frontend via WebSocket
  emitJobEvent(job.id!, {
    type: "JOB_COMPLETED",
    jobId: job.id!,
    message: "Question paper generated successfully!",
    progress: 100,
    data: {
      resultId: result._id.toString(),
      assignmentId,
      totalMarks: result.totalMarks,
      sectionsCount: result.sections.length,
    },
  });

  console.log(`✅ Generation job ${job.id} completed. Result: ${result._id}`);
}

export async function startGenerationWorker(): Promise<Worker> {
  await connectDatabase();

  const worker = new Worker<GenerationJobData>(
    process.env.GENERATION_QUEUE || "paper-generation",
    processGenerationJob,
    {
      connection: bullmqConnection,
      concurrency: 3,    // Process up to 3 jobs simultaneously
      limiter: {
        max: 10,         // Max 10 jobs per duration
        duration: 60_000, // Per minute (respect Anthropic rate limits)
      },
    }
  );

  worker.on("completed", (job) => {
    console.log(`✅ Worker: job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Worker: job ${job?.id} failed:`, err.message);

    if (job) {
      emitJobEvent(job.id!, {
        type: "JOB_FAILED",
        jobId: job.id!,
        message: err.message,
        progress: 0,
      });
    }
  });

  worker.on("error", (err) => {
    console.error("Worker error:", err);
  });

  console.log("✅ Generation worker started");
  return worker;
}

// If running as standalone process
if (require.main === module) {
  startGenerationWorker().catch(console.error);
}
