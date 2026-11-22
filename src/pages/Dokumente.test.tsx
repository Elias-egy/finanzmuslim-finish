import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Dokumente from "@/pages/Dokumente";
import { alleKarten } from "@/data/dokumente";

const zeige = () =>
  render(
    <MemoryRouter initialEntries={["/dokumente"]}>
      <Dokumente />
    </MemoryRouter>,
  );

describe("Seite /dokumente", () => {
  it("zeigt Titel Dokumente, den Check zuerst und jede Karte mit genau einem Knopf", () => {
    const { container } = zeige();
    expect(container.querySelector("h1")?.textContent).toBe("Dokumente");
    const gruppen = [...container.querySelectorAll("[data-dok-gruppe]")].map((g) => g.getAttribute("data-dok-gruppe"));
    expect(gruppen).toEqual(["match", "depot", "videos", "konto", "listen", "rechner"]);
    const karten = container.querySelectorAll("[data-dok]");
    expect(karten.length).toBe(alleKarten().length);
    for (const k of karten) expect(k.querySelectorAll("a").length, k.getAttribute("data-dok") ?? "").toBe(1);
  });

  it("offizielle Formulare öffnen in neuem Tab, Partner-Knöpfe gehen über /out", () => {
    const { container } = zeige();
    const flatex = container.querySelector('[data-dok="flatex-uebertrag"] a') as HTMLAnchorElement;
    expect(flatex.href).toBe("https://konto.flatex.de/formularcenter/public/1300002.pdf");
    expect(flatex.target).toBe("_blank");
    expect(flatex.rel).toContain("noopener");
    const eroeffnen = container.querySelector('[data-dok="flatex-eroeffnen"] a') as HTMLAnchorElement;
    expect(eroeffnen.getAttribute("href")).toBe("/out/flatex?src=dokfl");
    const check = container.querySelector('[data-dok="check"] a') as HTMLAnchorElement;
    expect(check.getAttribute("href")).toBe("/check?quelle=quiz");
    expect([...container.querySelectorAll("a")].filter((a) => a.textContent === "Match finden" && a.closest("main")).length).toBe(1);
  });

  it("zeigt die vier Einrichtungsvideos, je mit Video und Knopf direkt zum Anbieter", () => {
    const { container } = zeige();
    const videos = [...container.querySelectorAll("[data-dok-video]")];
    expect(videos.map((v) => v.getAttribute("data-dok-video"))).toEqual(["traders-place", "flatex", "smartbroker", "scalable"]);
    const erwartet: Record<string, string> = {
      "traders-place": "/out/traders-place?src=doktp",
      flatex: "/out/flatex?src=dokfl",
      smartbroker: "/out/smartbroker?src=doksb",
      scalable: "/out/scalable?src=doksc",
    };
    for (const v of videos) {
      const id = v.getAttribute("data-dok-video") ?? "";
      const video = v.querySelector("video") as HTMLVideoElement;
      expect(video.getAttribute("src"), id).toMatch(/^\/videos\/.+\.mp4$/);
      expect(video.getAttribute("preload"), id).toBe("none");
      expect(v.querySelector("a")?.getAttribute("href"), id).toBe(erwartet[id]);
    }
  });
});
