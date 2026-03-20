import { Icon } from "./Icon";
import { SAMPLE_ASSIGNMENTS } from "../constants";

export function Sidebar({ view, onNavigate }) {
  const navItems = [
    { id: "home", icon: "home", label: "Home" },
    { id: "groups", icon: "groups", label: "My Groups" },
    {
      id: "assignments",
      icon: "assignment",
      label: "Assignments",
      badge: SAMPLE_ASSIGNMENTS.length,
    },
    { id: "toolkit", icon: "toolkit", label: "AI Teacher's Toolkit" },
    { id: "library", icon: "library", label: "My Library" },
  ];

  const activeId = ["home", "groups", "toolkit", "library"].includes(view)
    ? view
    : "assignments";

  return (
    <aside
      style={{
        width: 260,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "24px 14px",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        borderRight: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 28,
          paddingLeft: 6,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "linear-gradient(135deg, #F0612D 0%, #ff8c61 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(240,97,45,0.35)",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: 20,
              fontFamily: "var(--font-manrope)",
            }}
          >
            V
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-manrope)",
            fontWeight: 800,
            fontSize: 22,
            color: "#1E1E1E",
          }}
        >
          VedaAI
        </span>
      </div>

      <button
        onClick={() => onNavigate("create")}
        style={{
          background: "#1E1E1E",
          color: "#fff",
          border: "2px solid #F0612D",
          borderRadius: 999,
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          marginBottom: 24,
          boxShadow: "0 0 0 2px #F0612D, 0 4px 16px rgba(0,0,0,0.25)",
          fontFamily: "var(--font-inter)",
        }}
      >
        <span style={{ fontSize: 15 }}>✦</span> Create Assignment
      </button>

      <nav
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
      >
        {navItems.map((item) => {
          const active = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 12px",
                borderRadius: 12,
                border: "none",
                background: active ? "#F4F4F4" : "transparent",
                color: active ? "#1E1E1E" : "#717171",
                fontWeight: active ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font-inter)",
                transition: "background 0.15s",
              }}
            >
              <Icon
                name={item.icon}
                size={18}
                color={active ? "#1E1E1E" : "#717171"}
              />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    background: "#F0612D",
                    color: "#fff",
                    fontSize: 10,
                    padding: "2px 7px",
                    borderRadius: 4,
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 14 }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            border: "none",
            background: "transparent",
            color: "#717171",
            fontSize: 14,
            cursor: "pointer",
            width: "100%",
            fontFamily: "var(--font-inter)",
          }}
        >
          <Icon name="settings" size={18} color="#717171" /> Settings
        </button>
        <div
          style={{
            background: "#F4F4F4",
            borderRadius: 16,
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 8,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "#ffe0d4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            🦁
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "#1E1E1E",
                fontFamily: "var(--font-inter)",
              }}
            >
              Delhi Public School
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#717171",
                fontFamily: "var(--font-inter)",
              }}
            >
              Bokaro Steel City
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
