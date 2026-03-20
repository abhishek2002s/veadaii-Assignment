"use client";
import { useState } from "react";
import { Icon } from "../components/Icon";
import { api } from "../lib/api";

export function LoginView({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login"); // "login" or "register"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await api.login(email, password);
      } else {
        await api.register({
          email,
          password,
          name: "New Teacher",
          schoolName: "Delhi Public School",
        });
      }
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top left, #2c3e50, #000)",
        fontFamily: "var(--font-inter)",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          borderRadius: 32,
          padding: 48,
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 40,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "linear-gradient(135deg, #F0612D 0%, #ff8c61 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 16px rgba(240,97,45,0.4)",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: 900,
                fontSize: 24,
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
              fontSize: 32,
              color: "#fff",
              letterSpacing: -1,
            }}
          >
            VedaAI
          </span>
        </div>

        <h2
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          {mode === "login" ? "Welcome Back" : "Start Generating"}
        </h2>
        <p
          style={{
            color: "#aaa",
            fontSize: 14,
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          {mode === "login"
            ? "Login to access your AI Teacher toolkit"
            : "Join VedaAI and transform your classroom"}
        </p>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              padding: "12px 16px",
              borderRadius: 12,
              fontSize: 13,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#666",
              }}
            >
              ✉️
            </span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px 14px 44px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                outline: "none",
                fontSize: 14,
                boxSizing: "border-box",
                transition: "all 0.2s",
              }}
              required
            />
          </div>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#666",
              }}
            >
              🔒
            </span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px 14px 44px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                outline: "none",
                fontSize: 14,
                boxSizing: "border-box",
                transition: "all 0.2s",
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 16,
              borderRadius: 16,
              background: "#F0612D",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? "wait" : "pointer",
              marginTop: 12,
              boxShadow: "0 12px 24px rgba(240,97,45,0.25)",
              transition: "transform 0.2s",
            }}
          >
            {loading
              ? "Authenticating..."
              : mode === "login"
                ? "Login"
                : "Register"}
          </button>
        </form>

        <div
          style={{
            marginTop: 32,
            textAlign: "center",
            color: "#aaa",
            fontSize: 14,
          }}
        >
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            style={{
              background: "none",
              border: "none",
              color: "#F0612D",
              fontWeight: 700,
              marginLeft: 6,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {mode === "login" ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}
