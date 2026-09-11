import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8F3EB",
        }}
      >
        <div
          style={{
            width: 360,
            height: 360,
            borderRadius: 80,
            background: "#E8ECFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#4865FF",
            fontSize: 180,
            fontWeight: 600,
          }}
        >
          K
        </div>
      </div>
    ),
    size,
  );
}
