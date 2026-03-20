"use client";
import { Icon } from "./Icon";

export function MobileHeader() {
  return (
    <header
      style={{
        padding: "16px 20px 8px",
        background: "#f4f4f4",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "#1E1E1E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: 900,
                fontSize: 18,
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
              fontSize: 18,
              color: "#1E1E1E",
            }}
          >
            VedaAI
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              position: "relative",
              background: "#f4f4f4",
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="bell" size={20} color="#1E1E1E" />
            <span
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 7,
                height: 7,
                background: "#F0612D",
                borderRadius: "50%",
                border: "1.5px solid #fff",
              }}
            />
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid #fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <Icon name="menu" size={24} color="#1E1E1E" />
        </div>
      </div>
    </header>
  );
}

export function MobileBottomNav({ activeView, onNavigate }) {
  const items = [
    { id: "home", icon: "home", label: "Home" },
    { id: "groups", icon: "groups", label: "My Groups" },
    { id: "library", icon: "library", label: "Library" },
    { id: "toolkit", icon: "spark", label: "AI Toolkit" },
  ];

  const activeId = ["home", "groups", "library", "toolkit"].includes(activeView)
    ? activeView
    : activeView === "assignments" ||
        activeView === "empty" ||
        activeView === "create" ||
        activeView === "output"
      ? "home" // Map assignment-related views back to Home for highlighting
      : "groups";

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        right: 20,
        background: "#1E1E1E",
        borderRadius: "24px",
        display: "flex",
        justifyContent: "space-around",
        padding: "12px 8px",
        zIndex: 1000,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      }}
    >
      {items.map((item) => {
        const active = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
              padding: "4px 8px",
              minWidth: 64,
              position: "relative", // Ensure dot is relative to this button
            }}
          >
            <div
              style={{
                color: active ? "#fff" : "#717171",
                transition:
                  "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                transform: active ? "scale(1.1) translateY(-2px)" : "scale(1)",
              }}
            >
              <Icon
                name={item.icon}
                size={20}
                color={active ? "#fff" : "#717171"}
              />
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                color: active ? "#fff" : "#717171",
                fontFamily: "var(--font-inter)",
              }}
            >
              {item.label}
            </span>
            {active && (
              <div
                style={{
                  position: "absolute",
                  bottom: -2,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#fff",
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

export function FloatingAddButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 100,
        right: 20,
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "#fff",
        color: "#F0612D",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        border: "none",
        cursor: "pointer",
        zIndex: 900,
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Icon name="add" size={24} color="#F0612D" />
    </button>
  );
}
