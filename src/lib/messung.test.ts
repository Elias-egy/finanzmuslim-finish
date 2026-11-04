import { beforeEach, describe, expect, it, vi } from "vitest";
import { EINWILLIGUNG_FASSUNG, leseWahl, setzeWahl } from "./messung";

// Mit echtem Schlüssel lädt „Akzeptieren“ PostHog; im Test ohne Netz und ohne Zeitgeber nach dem Testende.
vi.mock("posthog-js", () => ({
  default: { init: vi.fn(), register: vi.fn(), capture: vi.fn(), opt_out_capturing: vi.fn(), reset: vi.fn() },
}));

describe("Einwilligung", () => {
  beforeEach(() => localStorage.clear());

  it("fragt, solange nichts gewählt ist", () => {
    expect(leseWahl()).toBeNull();
  });

  it("merkt sich Ablehnen und Akzeptieren", () => {
    setzeWahl("nein");
    expect(leseWahl()).toBe("nein");
    setzeWahl("ja");
    expect(leseWahl()).toBe("ja");
  });

  it("fragt neu, wenn sich der Bannertext geändert hat", () => {
    localStorage.setItem("fm-einwilligung", JSON.stringify({ wahl: "ja", fassung: "alt" }));
    expect(leseWahl()).toBeNull();
    expect(EINWILLIGUNG_FASSUNG).not.toBe("alt");
  });
});
