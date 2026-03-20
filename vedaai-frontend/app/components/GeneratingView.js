"use client";
import { useState, useEffect } from "react";

export function GeneratingView() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Connecting to AI...");
  useEffect(() => {
    const stages = [
      [400, "Analyzing parameters..."],
      [1100, "Building structured prompt..."],
      [2000, "Generating questions with AI..."],
      [3000, "Organizing into sections..."],
      [3800, "Finalizing paper..."],
    ];
    const iv = setInterval(() => setProgress((p) => Math.min(p + 2, 95)), 80);
    stages.forEach(([d, s]) => setTimeout(() => setStatus(s), d));
    return () => clearInterval(iv);
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: 60,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#F0612D,#ff8c61)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 42,
          marginBottom: 32,
        }}
      >
        ✦
      </div>
      <h2
        style={{
          fontFamily: "var(--font-manrope)",
          fontWeight: 800,
          fontSize: 24,
          marginBottom: 10,
          color: "#1E1E1E",
        }}
      >
        Generating Your Question Paper
      </h2>
      <p
        style={{
          color: "#717171",
          fontSize: 14,
          marginBottom: 36,
          fontFamily: "var(--font-inter)",
        }}
      >
        {status}
      </p>
      <div
        style={{
          width: 360,
          height: 6,
          background: "#e5e5e5",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg,#F0612D,#ff8c61)",
            borderRadius: 999,
            transition: "width 0.08s linear",
          }}
        />
      </div>
      <p
        style={{
          color: "#aaa",
          fontSize: 12,
          marginTop: 10,
          fontFamily: "var(--font-inter)",
        }}
      >
        {progress}%
      </p>
    </div>
  );
}
