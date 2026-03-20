import { Icon } from "./Icon";
import { SAMPLE_ASSIGNMENTS } from "../constants";

export function HomePage({ isMobile, onNavigate }) {
  const stats = [
    {
      label: "Total Assignments",
      value: SAMPLE_ASSIGNMENTS.length,
      color: "#F0612D",
      bg: "#FEF0EC",
      icon: "assignment",
    },
    {
      label: "Created This Week",
      value: 3,
      color: "#7c3aed",
      bg: "#f3e8ff",
      icon: "star",
    },
    {
      label: "Total Marks (Avg)",
      value: "42/60",
      color: "#0891b2",
      bg: "#e0f2fe",
      icon: "check",
    },
  ];
  const recentActivities = [
    {
      text: "Quiz on Electricity generated",
      time: "2 hours ago",
      icon: "spark",
    },
    {
      text: "Chemical Reactions Test created",
      time: "Yesterday",
      icon: "assignment",
    },
    { text: "Light & Optics Quiz assigned", time: "2 days ago", icon: "check" },
  ];

  return (
    <div
      style={{
        padding: isMobile ? "24px 20px 100px" : "36px 40px",
        maxWidth: 1000,
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              background: "#22c55e",
              borderRadius: "50%",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 13,
              color: "#22c55e",
              fontWeight: 600,
              fontFamily: "var(--font-inter)",
            }}
          >
            Active Session
          </span>
        </div>
        <h1
          style={{
            fontFamily: "var(--font-manrope)",
            fontWeight: 800,
            fontSize: isMobile ? 24 : 30,
            color: "#1E1E1E",
            marginBottom: 6,
          }}
        >
          Welcome back, John! 👋
        </h1>
        <p
          style={{
            color: "#717171",
            fontSize: isMobile ? 14 : 15,
            fontFamily: "var(--font-inter)",
          }}
        >
          Here's what's happening with your assignments today.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(auto-fit, minmax(160px, 1fr))" : "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: isMobile ? "20px" : "22px 24px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              border: "1px solid #f0f0f0",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              gap: isMobile ? 12 : 18,
            }}
          >
            <div
              style={{
                width: isMobile ? 40 : 52,
                height: isMobile ? 40 : 52,
                borderRadius: 12,
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name={s.icon} size={isMobile ? 18 : 24} color={s.color} />
            </div>
            <div>
              <div
                style={{
                  fontSize: isMobile ? 22 : 28,
                  fontWeight: 800,
                  color: "#1E1E1E",
                  fontFamily: "var(--font-manrope)",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#717171",
                  marginTop: 4,
                  fontFamily: "var(--font-inter)",
                }}
              >
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "3fr 2fr",
          gap: 24,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: isMobile ? 24 : 28,
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            border: "1px solid #f0f0f0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-manrope)",
                fontWeight: 700,
                fontSize: 16,
                color: "#1E1E1E",
              }}
            >
              Recent Assignments
            </h3>
            <button
              onClick={() => onNavigate("assignments")}
              style={{
                background: "none",
                border: "none",
                color: "#F0612D",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-inter)",
              }}
            >
              View all →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SAMPLE_ASSIGNMENTS.slice(0, 5).map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "#fafafa",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#FEF3C7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="assignment" size={16} color="#d97706" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      color: "#1E1E1E",
                      fontFamily: "var(--font-inter)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {a.title}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#aaa",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    Due: {a.due}
                  </div>
                </div>
                {!isMobile && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 6,
                      background: "#dcfce7",
                      color: "#16a34a",
                      fontFamily: "var(--font-inter)",
                      flexShrink: 0,
                    }}
                  >
                    Active
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              background: "linear-gradient(135deg,#1E1E1E 0%,#3a3a3a 100%)",
              borderRadius: 20,
              padding: isMobile ? 24 : 28,
              color: "#fff",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-manrope)",
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              Create with AI ✦
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "#9ca3af",
                marginBottom: 20,
                fontFamily: "var(--font-inter)",
                lineHeight: 1.6,
              }}
            >
              Generate a complete question paper in seconds.
            </p>
            <button
              onClick={() => onNavigate("create")}
              style={{
                background: "#F0612D",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "10px 22px",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-inter)",
              }}
            >
              <Icon name="add" size={16} color="#fff" /> New Assignment
            </button>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              border: "1px solid #f0f0f0",
              flex: 1,
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-manrope)",
                fontWeight: 700,
                fontSize: 15,
                color: "#1E1E1E",
                marginBottom: 16,
              }}
            >
              Recent Activity
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {recentActivities.map((act, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "#f4f4f4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={act.icon} size={15} color="#717171" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#1E1E1E",
                        fontWeight: 500,
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {act.text}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#aaa",
                        fontFamily: "var(--font-inter)",
                        marginTop: 2,
                      }}
                    >
                      {act.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
