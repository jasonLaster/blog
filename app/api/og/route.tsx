import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const baseURL = "https://jlast.dev";

export function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // ?title=<title>
    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "My default title";

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "black",
            backgroundSize: "150px 150px",
            height: "100%",
            width: "100%",
            display: "flex",
            position: "relative",
            padding: "60px",
          }}
        >
          {/* Title - vertically centered and left aligned */}
          <div
            style={{
              fontSize: 60,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              color: "white",
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
              alignSelf: "center",
              textAlign: "left",
              flex: 1,
            }}
          >
            {title}
          </div>

          {/* Bottom right container for image and URL */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "40px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: "32px",
                fontWeight: "500",
              }}
            >
              jlast.dev
            </span>
            <img
              alt="Jlast"
              src={`${baseURL}/jlast.jpg`}
              height={80}
              width={80}
              style={{ borderRadius: "20px" }}
            />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.log(
      `Error generating image: ${e instanceof Error ? e.message : String(e)}`
    );
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
