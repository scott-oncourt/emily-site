import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Emily — Cambodia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at 30% 60%, #1a120a 0%, #0d0805 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          fontFamily: "Georgia, serif",
          color: "#EDDFC3",
        }}
      >
        <div
          style={{
            fontSize: 14,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#E8843E",
            fontFamily: "system-ui",
          }}
        >
          Cambodia · Photography
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 200,
              lineHeight: 1,
              fontWeight: 300,
              letterSpacing: "-0.01em",
            }}
          >
            Emily
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#C0764E",
              fontFamily: "system-ui",
            }}
          >
            Ancient grace · Modern world · Pure Cambodia
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 14,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(237,223,195,0.55)",
            fontFamily: "system-ui",
          }}
        >
          <span>Khmer · ប្រាសាទ</span>
          <span>emilycambodia</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
