import { ImageResponse } from "next/og";

export const alt = "DBtext — Study writing, made clear";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

const notebookLines = [110, 190, 270, 350, 430, 510, 590];

export default function TwitterImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#fffbeb",
        color: "#13233f",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      {notebookLines.map((top) => (
        <div
          key={top}
          style={{
            background: "#dce5eb",
            height: 2,
            left: 0,
            position: "absolute",
            right: 0,
            top,
          }}
        />
      ))}
      <div
        style={{
          background: "#efb4a9",
          bottom: 0,
          left: 92,
          position: "absolute",
          top: 0,
          width: 2,
        }}
      />

      <div
        style={{
          alignItems: "flex-start",
          background: "#fffef9",
          border: "3px solid #16345d",
          borderRadius: 42,
          display: "flex",
          flexDirection: "column",
          padding: "58px 70px",
          position: "relative",
          width: 960,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Arial, sans-serif",
            fontSize: 106,
            fontWeight: 800,
            letterSpacing: "-8px",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#d6007f" }}>D</span>
          <span style={{ color: "#ff1493" }}>B</span>
          <span style={{ color: "#237a40" }}>text</span>
        </div>
        <div
          style={{
            color: "#16345d",
            display: "flex",
            fontFamily: "Arial, sans-serif",
            fontSize: 48,
            fontWeight: 700,
            marginTop: 28,
          }}
        >
          Study writing, made clear.
        </div>
        <div
          style={{
            color: "#5d6878",
            display: "flex",
            fontFamily: "Arial, sans-serif",
            fontSize: 28,
            marginTop: 24,
          }}
        >
          Clear, natural explanations for high-school students.
        </div>
        <div
          style={{
            color: "#9a5a08",
            display: "flex",
            fontFamily: "Arial, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "2px",
            marginTop: 42,
          }}
        >
          WWW.DBTEXT.DEV
        </div>
      </div>
    </div>,
    size
  );
}
