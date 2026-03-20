"use client";
import { Icon } from "./Icon";

export function OutputView({ isMobile, paper, onRegenerate }) {
  const dc = (d) =>
    d === "Easy"
      ? { color: "#16a34a", bg: "#dcfce7" }
      : d === "Moderate"
        ? { color: "#2563eb", bg: "#dbeafe" }
        : { color: "#dc2626", bg: "#fee2e2" };
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: isMobile ? "20px 20px 100px" : "32px 36px 60px",
      }}
    >
      <div
        style={{
          background: "#1E1E1E",
          color: "#fff",
          borderRadius: 16,
          padding: isMobile ? "24px 20px" : "20px 28px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
          gap: 16,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <p
          style={{
            fontSize: isMobile ? 12 : 14,
            lineHeight: 1.6,
            fontFamily: "var(--font-inter)",
            flex: 1,
            margin: 0,
          }}
        >
          ✦ Here is your customized Question Paper for CBSE Grade 9 Science
          class on the NCERT chapters.
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            width: isMobile ? "100%" : "auto",
          }}
        >
          <button
            onClick={onRegenerate}
            style={{
              flex: isMobile ? 1 : "initial",
              background: "#F0612D",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 14px",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontFamily: "var(--font-inter)",
            }}
          >
            <Icon name="refresh" size={14} color="#fff" />{" "}
            {isMobile ? "Recompute" : "Regenerate"}
          </button>
          <button
            onClick={() => window.print()}
            style={{
              flex: isMobile ? 1 : "initial",
              background: "#fff",
              color: "#1E1E1E",
              border: "none",
              borderRadius: 12,
              padding: "12px 14px",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontFamily: "var(--font-inter)",
            }}
          >
            <Icon name="download" size={14} color="#1E1E1E" />{" "}
            {isMobile ? "Export" : "Download PDF"}
          </button>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          border: "1px solid #e5e5e5",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: isMobile ? "32px 24px 20px" : "40px 56px 28px",
            textAlign: "center",
            borderBottom: "2px dashed #e5e5e5",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-manrope)",
              fontWeight: 900,
              fontSize: isMobile ? 16 : 22,
              color: "#1E1E1E",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 8,
              lineHeight: 1.3,
            }}
          >
            Delhi Public School, Sector-4, Bokaro
          </h2>
          <div
            style={{
              color: "#717171",
              fontFamily: "var(--font-inter)",
              lineHeight: 1.6,
              fontSize: isMobile ? 12 : 14,
            }}
          >
            Subject: {paper.subject} | Class: {paper.class}
          </div>
        </div>

        <div style={{ padding: isMobile ? "24px" : "24px 56px 56px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: isMobile ? 11 : 13,
              fontWeight: 700,
              borderBottom: "1px solid #f0f0f0",
              paddingBottom: 16,
              marginBottom: 16,
              fontFamily: "var(--font-inter)",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 8 : 0,
            }}
          >
            <span>Time Allowed: {paper.time}</span>
            <span>Maximum Marks: {paper.totalMarks}</span>
          </div>

          <p
            style={{
              fontSize: 11,
              color: "#aaa",
              fontStyle: "italic",
              marginBottom: 28,
              fontFamily: "var(--font-inter)",
            }}
          >
            All questions are compulsory unless stated otherwise.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? "12px" : "16px 40px",
              marginBottom: 40,
              fontSize: 13,
              fontFamily: "var(--font-inter)",
              fontWeight: 700,
            }}
          >
            {["Name", "Roll Number", "Class: 9th", "Section"].map(
              (label, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 8,
                    borderBottom: "1px solid #d1d5db",
                    paddingBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 12 }}>{label}:</span>
                  <div style={{ flex: 1 }} />
                </div>
              ),
            )}
          </div>

          {paper.sections?.map((section, si) => (
            <div key={si} style={{ marginBottom: 40 }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-manrope)",
                    fontWeight: 900,
                    fontSize: isMobile ? 16 : 20,
                    display: "inline-block",
                    borderBottom: "2px solid #F0612D",
                    paddingBottom: 4,
                  }}
                >
                  Section {section.name}
                </h3>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: isMobile ? 13 : 14,
                    marginTop: 10,
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {section.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#aaa",
                    fontStyle: "italic",
                    marginTop: 4,
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {section.instruction}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: isMobile ? 24 : 18,
                }}
              >
                {section.questions?.map((q, qi) => {
                  const c = dc(q.difficulty);
                  return (
                    <div key={qi} style={{ display: "flex", gap: 12 }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: 13,
                          minWidth: 20,
                          fontFamily: "var(--font-inter)",
                        }}
                      >
                        {q.number}.
                      </span>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                background: c.bg,
                                color: c.color,
                                fontSize: 9,
                                fontWeight: 800,
                                padding: "1px 6px",
                                borderRadius: 4,
                                fontFamily: "var(--font-inter)",
                                textTransform: "uppercase",
                              }}
                            >
                              {q.difficulty}
                            </span>
                            <span
                              style={{
                                fontWeight: 800,
                                fontSize: 12,
                                color: "#1E1E1E",
                                fontFamily: "var(--font-inter)",
                              }}
                            >
                              [{q.marks} {q.marks === 1 ? "Mark" : "Marks"}]
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: 14,
                              color: "#374151",
                              fontFamily: "var(--font-inter)",
                              lineHeight: 1.5,
                            }}
                          >
                            {q.text}
                          </span>
                        </div>
                        {q.options && (
                          <div
                            style={{
                              marginTop: 14,
                              display: "grid",
                              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                              gap: "10px 24px",
                            }}
                          >
                            {q.options.map((opt, oi) => (
                              <div
                                key={oi}
                                style={{
                                  fontSize: 13,
                                  color: "#4b5563",
                                  fontFamily: "var(--font-inter)",
                                  display: "flex",
                                  gap: 8,
                                }}
                              >
                                <span style={{ fontWeight: 700 }}>
                                  ({String.fromCharCode(65 + oi)})
                                </span>{" "}
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div
            style={{
              textAlign: "center",
              borderTop: "1px dashed #e5e5e5",
              paddingTop: 20,
              marginBottom: 40,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "#aaa",
                letterSpacing: 2,
                textTransform: "uppercase",
                fontFamily: "var(--font-inter)",
              }}
            >
              End of Question Paper
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
