import { Icon } from "./Icon";

export function TopBar({ label, onBack, showBack }) {
  return (
    <header
      style={{
        height: 64,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {showBack && (
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              padding: 6,
            }}
          >
            <Icon name="back" size={20} color="#717171" />
          </button>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="assignment" size={14} color="#aaa" />
          <span
            style={{
              fontSize: 14,
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              color: "#717171",
            }}
          >
            {label}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          style={{
            position: "relative",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
          }}
        >
          <Icon name="bell" size={22} color="#717171" />
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 8,
              height: 8,
              background: "#F0612D",
              borderRadius: "50%",
              border: "2px solid #fff",
            }}
          />
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            padding: "6px 14px",
            borderRadius: 999,
            border: "1px solid #f0f0f0",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            👤
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 14,
              fontFamily: "var(--font-inter)",
              color: "#1E1E1E",
            }}
          >
            John Doe
          </span>
          <Icon name="chevron" size={14} color="#aaa" />
        </div>
      </div>
    </header>
  );
}
