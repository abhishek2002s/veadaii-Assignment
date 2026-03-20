"use client";
import { useState } from "react";
import { Icon } from "./Icon";

export function EmptyAssignments({ isMobile, onCreate }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: isMobile ? "40px 20px" : 60,
      }}
    >
      <div
        style={{
          position: "relative",
          width: isMobile ? 200 : 260,
          height: isMobile ? 200 : 260,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#e5e5e5",
            borderRadius: "50%",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "18%",
            left: "20%",
            width: isMobile ? 80 : 100,
            height: isMobile ? 100 : 130,
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ height: 8, background: "#1E1E1E", borderRadius: 4 }} />
          {[80, 100, 75, 100, 50, 100].map((w, i) => (
            <div
              key={i}
              style={{
                height: 5,
                background: "#e5e5e5",
                borderRadius: 3,
                width: `${w}%`,
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "6%",
            right: "8%",
            width: isMobile ? 80 : 110,
            height: isMobile ? 80 : 110,
            borderRadius: "50%",
            border: `${isMobile ? 8 : 10}px solid #d1d5db`,
            background: "rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile ? 40 : 52,
            fontWeight: 900,
            color: "#ef4444",
          }}
        >
          ✕
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: "8%",
            width: 40,
            height: 14,
            background: "#d1d5db",
            borderRadius: 999,
            transform: "rotate(45deg) translateX(10px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "28%",
            left: "8%",
            fontSize: 18,
            color: "#60a5fa",
          }}
        >
          ✦
        </div>
        <div
          style={{
            position: "absolute",
            top: "54%",
            right: "17%",
            width: 10,
            height: 10,
            background: "#60a5fa",
            borderRadius: "50%",
            opacity: 0.6,
          }}
        />
      </div>
      <h2
        style={{
          fontFamily: "var(--font-manrope)",
          fontWeight: 800,
          fontSize: isMobile ? 22 : 26,
          color: "#1E1E1E",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        No assignments yet
      </h2>
      <p
        style={{
          color: "#717171",
          fontSize: 13,
          maxWidth: 320,
          textAlign: "center",
          lineHeight: 1.6,
          marginBottom: 32,
          fontFamily: "var(--font-inter)",
        }}
      >
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>
      <button
        onClick={onCreate}
        style={{
          background: "#1E1E1E",
          color: "#fff",
          border: "none",
          borderRadius: 999,
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontWeight: 800,
          fontSize: 15,
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          fontFamily: "var(--font-inter)",
        }}
      >
        <Icon name="add" size={18} color="#fff" /> Create Your First Assignment
      </button>
    </div>
  );
}

export function AssignmentCard({ assignment, onView }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 24,
        padding: "28px 28px 24px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        border: "1px solid #f0f0f0",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 36,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-manrope)",
            fontWeight: 800,
            fontSize: 19,
            color: "#1E1E1E",
            lineHeight: 1.3,
          }}
        >
          {assignment.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((o) => !o);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            padding: 4,
          }}
        >
          <Icon name="more" size={20} color="#ccc" />
        </button>
      </div>
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: 56,
            right: 20,
            zIndex: 20,
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: "1px solid #f0f0f0",
            overflow: "hidden",
            minWidth: 160,
          }}
        >
          <button
            onClick={() => {
              setMenuOpen(false);
              onView(assignment);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "13px 20px",
              border: "none",
              background: "none",
              textAlign: "left",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--font-inter)",
            }}
          >
            View Assignment
          </button>
          <button
            style={{
              display: "block",
              width: "100%",
              padding: "13px 20px",
              border: "none",
              borderTop: "1px solid #f9f9f9",
              background: "none",
              textAlign: "left",
              fontSize: 14,
              fontWeight: 500,
              color: "#ef4444",
              cursor: "pointer",
              fontFamily: "var(--font-inter)",
            }}
          >
            Delete
          </button>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          fontFamily: "var(--font-inter)",
        }}
      >
        <span>
          <b>Assigned on :</b>{" "}
          <span style={{ color: "#717171", fontWeight: 400 }}>
            {assignment.assignedOn}
          </span>
        </span>
        <span>
          <b>Due :</b>{" "}
          <span style={{ color: "#717171", fontWeight: 400 }}>
            {assignment.due}
          </span>
        </span>
      </div>
    </div>
  );
}

export function AssignmentsView({
  isMobile,
  assignments,
  onCreate,
  onView,
  onBack,
}) {
  const [search, setSearch] = useState("");
  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ padding: isMobile ? "20px" : "32px 36px" }}>
      {isMobile && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
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
          <h2
            style={{
              fontFamily: "var(--font-manrope)",
              fontWeight: 800,
              fontSize: 18,
              color: "#1E1E1E",
              margin: 0,
            }}
          >
            Assignments
          </h2>
        </div>
      )}

      {!isMobile && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                background: "#22c55e",
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            <h2
              style={{
                fontFamily: "var(--font-manrope)",
                fontWeight: 700,
                fontSize: 24,
                color: "#1E1E1E",
              }}
            >
              Assignments
            </h2>
          </div>
          <p
            style={{
              color: "#717171",
              fontSize: 14,
              fontFamily: "var(--font-inter)",
            }}
          >
            Manage and create assignments for your classes.
          </p>
        </div>
      )}

      <div
        style={{
          background: isMobile ? "transparent" : "#fff",
          borderRadius: isMobile ? 0 : 999,
          padding: isMobile ? 0 : "10px 24px",
          boxShadow: isMobile ? "none" : "0 2px 8px rgba(0,0,0,0.05)",
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 12 : 20,
          border: isMobile ? "none" : "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#717171",
            fontSize: 14,
            fontFamily: "var(--font-inter)",
            background: "#fff",
            padding: "12px 20px",
            borderRadius: 16,
            boxShadow: isMobile ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
          }}
        >
          <Icon name="filter" size={16} color="#aaa" />{" "}
          {isMobile ? "Filter" : "Filter By"}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            padding: "12px 20px",
            borderRadius: 16,
            flex: 1,
            boxShadow: isMobile ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
            border: isMobile ? "none" : "1px solid #f0f0f0",
          }}
        >
          <Icon name="search" size={16} color="#aaa" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Name"
            style={{
              border: "none",
              background: "transparent",
              fontSize: 14,
              outline: "none",
              width: "100%",
              fontFamily: "var(--font-inter)",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 20,
          paddingBottom: isMobile ? 120 : 80,
        }}
      >
        {filtered.map((a) => (
          <AssignmentCard key={a.id} assignment={a} onView={onView} />
        ))}
      </div>

      {!isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 260,
            right: 0,
            padding: 28,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <button
            onClick={onCreate}
            style={{
              pointerEvents: "all",
              background: "#1E1E1E",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "13px 26px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              fontFamily: "var(--font-inter)",
            }}
          >
            <Icon name="add" size={18} color="#fff" /> Create Assignment
          </button>
        </div>
      )}
    </div>
  );
}
