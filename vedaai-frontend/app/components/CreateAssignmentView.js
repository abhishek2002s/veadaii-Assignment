"use client";
import { useState, useRef } from "react";
import { Icon } from "./Icon";
import { QUESTION_TYPES } from "../constants";

export function CreateAssignmentView({ isMobile, onBack, onGenerate }) {
  const [file, setFile] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [questionTypes, setQuestionTypes] = useState([
    { type: "Multiple Choice Questions", questions: 4, marks: 4 },
    { type: "Short Questions", questions: 4, marks: 4 },
  ]);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  const updateQ = (i, field, val) =>
    setQuestionTypes((prev) =>
      prev.map((q, idx) =>
        idx === i ? { ...q, [field]: Math.max(0, val) } : q,
      ),
    );
  const removeQ = (i) =>
    setQuestionTypes((prev) => prev.filter((_, idx) => idx !== i));
  const addQ = () => {
    const used = questionTypes.map((q) => q.type);
    const avail = QUESTION_TYPES.filter((t) => !used.includes(t));
    if (avail.length)
      setQuestionTypes((prev) => [
        ...prev,
        { type: avail[0], questions: 4, marks: 4 },
      ]);
  };
  const totalQ = questionTypes.reduce((s, q) => s + q.questions, 0);
  const totalM = questionTypes.reduce((s, q) => s + q.questions * q.marks, 0);

  const validate = () => {
    const e = {};
    if (!dueDate) e.dueDate = "Due date is required";
    if (!questionTypes.length) e.qtype = "Add at least one question type";
    questionTypes.forEach((q, i) => {
      if (q.questions <= 0) e[`q${i}`] = "Must be > 0";
      if (q.marks <= 0) e[`m${i}`] = "Must be > 0";
    });
    setErrors(e);
    return !Object.keys(e).length;
  };

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: isMobile ? "20px 20px 140px" : "32px 36px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {isMobile && (
          <button
            onClick={onBack}
            style={{
              background: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Icon name="back" size={20} color="#1E1E1E" />
          </button>
        )}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            {!isMobile && (
              <span
                style={{
                  width: 10,
                  height: 10,
                  background: "#22c55e",
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              />
            )}
            <h2
              style={{
                fontFamily: "var(--font-manrope)",
                fontWeight: 700,
                fontSize: isMobile ? 18 : 22,
                color: "#1E1E1E",
                margin: 0,
              }}
            >
              Create Assignment
            </h2>
          </div>
          {!isMobile && (
            <p
              style={{
                color: "#717171",
                fontSize: 13,
                fontFamily: "var(--font-inter)",
                margin: 0,
              }}
            >
              Set up a new assignment for your students
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          height: 4,
          background: "#e5e5e5",
          borderRadius: 999,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: "50%",
            height: "100%",
            background: "#1E1E1E",
            borderRadius: 999,
          }}
        />
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: isMobile ? 24 : 36,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          marginBottom: 24,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-manrope)",
            fontWeight: 800,
            fontSize: 18,
            marginBottom: 4,
          }}
        >
          Assignment Details
        </h3>
        <p
          style={{
            color: "#aaa",
            fontSize: 13,
            marginBottom: 24,
            fontFamily: "var(--font-inter)",
          }}
        >
          Basic information about your assignment
        </p>

        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: "2px dashed #d1d5db",
            borderRadius: 16,
            padding: "32px 20px",
            textAlign: "center",
            cursor: "pointer",
            background: "#fafafa",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              background: "#fff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Icon name="upload" size={20} color="#1E1E1E" />
          </div>
          {file ? (
            <p style={{ fontWeight: 700, fontSize: 14, color: "#1E1E1E" }}>
              {file.name}
            </p>
          ) : (
            <>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#1E1E1E",
                  marginBottom: 4,
                }}
              >
                Choose a file or drag & drop it here
              </p>
              <p style={{ color: "#aaa", fontSize: 12, marginBottom: 16 }}>
                JPEG, PNG, upto 10MB
              </p>
              <span
                style={{
                  padding: "8px 20px",
                  borderRadius: 999,
                  border: "1px solid #e5e5e5",
                  background: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "var(--font-inter)",
                }}
              >
                Browse Files
              </span>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <p
          style={{
            color: "#aaa",
            fontSize: 12,
            textAlign: "center",
            marginBottom: 28,
            fontFamily: "var(--font-inter)",
          }}
        >
          Upload images of your preferred document/image
        </p>

        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display: "block",
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 8,
              fontFamily: "var(--font-inter)",
            }}
          >
            Due Date
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={dueDate}
              placeholder="Choose a chapter"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => !dueDate && (e.target.type = "text")}
              onChange={(e) => {
                setDueDate(e.target.value);
                setErrors((p) => ({ ...p, dueDate: "" }));
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "none",
                background: "#f0f0f0",
                fontSize: 14,
                fontFamily: "var(--font-inter)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <Icon name="library" size={18} color="#717171" />
            </div>
          </div>
          {errors.dueDate && (
            <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
              {errors.dueDate}
            </p>
          )}
        </div>

        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            fontFamily: "var(--font-inter)",
            marginBottom: 16,
          }}
        >
          Question Type
        </div>
        {errors.qtype && (
          <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>
            {errors.qtype}
          </p>
        )}

        {questionTypes.map((qt, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid #f0f0f0",
              borderRadius: 16,
              padding: "16px",
              marginBottom: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <select
                value={qt.type}
                onChange={(e) =>
                  setQuestionTypes((prev) =>
                    prev.map((q, idx) =>
                      idx === i ? { ...q, type: e.target.value } : q,
                    ),
                  )
                }
                style={{
                  background: "none",
                  border: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  fontFamily: "var(--font-inter)",
                  outline: "none",
                  color: "#1E1E1E",
                }}
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeQ(i)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                <Icon name="close" size={16} color="#aaa" />
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#717171",
                    marginBottom: 6,
                    fontWeight: 600,
                  }}
                >
                  No. of Questions
                </div>
                <div
                  style={{
                    background: "#f5f5f5",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                  }}
                >
                  <button
                    onClick={() => updateQ(i, "questions", qt.questions - 1)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#717171",
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontWeight: 800, fontSize: 14 }}>
                    {qt.questions}
                  </span>
                  <button
                    onClick={() => updateQ(i, "questions", qt.questions + 1)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#717171",
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#717171",
                    marginBottom: 6,
                    fontWeight: 600,
                  }}
                >
                  Marks
                </div>
                <div
                  style={{
                    background: "#f5f5f5",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                  }}
                >
                  <button
                    onClick={() => updateQ(i, "marks", qt.marks - 1)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#717171",
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontWeight: 800, fontSize: 14 }}>
                    {qt.marks}
                  </span>
                  <button
                    onClick={() => updateQ(i, "marks", qt.marks + 1)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#717171",
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addQ}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "none",
            background: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 14,
            fontFamily: "var(--font-inter)",
            marginBottom: 24,
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              background: "#1E1E1E",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="add" size={16} color="#fff" />
          </span>
          Add Question Type
        </button>

        <div
          style={{
            textAlign: "right",
            fontFamily: "var(--font-inter)",
            fontSize: 13,
            fontWeight: 700,
            color: "#717171",
          }}
        >
          <div>
            Total Questions : <span style={{ color: "#1E1E1E" }}>{totalQ}</span>
          </div>
          <div style={{ marginTop: 4 }}>
            Total Marks : <span style={{ color: "#1E1E1E" }}>{totalM}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: "16px",
            borderRadius: 999,
            border: "none",
            background: "#fff",
            color: "#1E1E1E",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: "var(--font-inter)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          ← Previous
        </button>
        <button
          onClick={() =>
            validate() &&
            onGenerate({ dueDate, questionTypes, instructions, file })
          }
          style={{
            flex: 1,
            padding: "16px",
            borderRadius: 999,
            border: "none",
            background: "#1E1E1E",
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: "var(--font-inter)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
