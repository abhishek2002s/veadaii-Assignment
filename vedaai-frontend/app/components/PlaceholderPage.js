import { Icon } from "./Icon";

export function PlaceholderPage({ title, icon, description }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: 60,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          background: "#f4f4f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <Icon name={icon} size={36} color="#aaa" />
      </div>
      <h2
        style={{
          fontFamily: "var(--font-manrope)",
          fontWeight: 800,
          fontSize: 24,
          color: "#1E1E1E",
          marginBottom: 10,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          color: "#717171",
          fontSize: 14,
          fontFamily: "var(--font-inter)",
          maxWidth: 360,
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>
    </div>
  );
}
