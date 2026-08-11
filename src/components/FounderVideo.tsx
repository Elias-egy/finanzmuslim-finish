import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const VIDEO_ID = "JZSfozOrMpE";

let ytApiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}

export function FounderVideo() {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadYouTubeApi().then(() => {
      if (cancelled || !hostRef.current) return;
      playerRef.current = new window.YT.Player(hostRef.current, {
        videoId: VIDEO_ID,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1,
          mute: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          controls: 1,
          cc_load_policy: 0,
        },
        events: {
          onReady: (e: any) => {
            try {
              e.target.mute();
              e.target.playVideo();
            } catch {}
            setReady(true);
          },
        },
      });
    });
    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {}
    };
  }, []);

  const toggleSound = () => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (muted) {
        p.unMute();
        p.setVolume(100);
        p.playVideo();
        setMuted(false);
      } else {
        p.mute();
        setMuted(true);
      }
    } catch {}
  };

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] bg-black">
      <div ref={hostRef} className="absolute inset-0 h-full w-full" />
      {ready && muted && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label="Ton einschalten"
          className="absolute inset-0 m-auto h-fit w-fit flex items-center gap-2 px-5 py-3 rounded-full bg-[hsl(160_25%_9%)]/90 backdrop-blur-sm border border-gold/60 text-white text-sm font-semibold shadow-[0_0_0_0_hsl(var(--gold)/0.6)] animate-pulse hover:animate-none hover:bg-[hsl(160_25%_9%)] transition"
          style={{ boxShadow: "0 0 24px hsl(var(--gold) / 0.35)" }}
        >
          <Volume2 className="h-4 w-4 text-gold" />
          <span>Ton an</span>
        </button>
      )}
      {ready && !muted && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label="Stummschalten"
          className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 text-white/90 flex items-center justify-center hover:bg-black/80 transition"
        >
          <VolumeX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default FounderVideo;
