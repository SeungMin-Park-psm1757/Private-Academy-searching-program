import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { runPublicBotProtection } from "./bot-protection";

describe("bot protection stub", () => {
  it("allows a normal browser request", async () => {
    const request = new NextRequest("http://127.0.0.1:3000/api/public/recommendations", {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0",
      },
    });

    const result = await runPublicBotProtection(request);

    expect(result.allowed).toBe(true);
    expect(result.provider).toBe("stub");
  });

  it("blocks a manually flagged request", async () => {
    const request = new NextRequest("http://127.0.0.1:3000/api/public/recommendations", {
      headers: {
        "x-bot-check": "block",
      },
    });

    const result = await runPublicBotProtection(request);

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("manual_block_header");
  });
});
