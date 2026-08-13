export const InstagramLogo = ({
  className = "h-6 w-6",
  muted = false,
}: {
  className?: string;
  muted?: boolean;
}) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <defs>
      <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#FDF497" />
        <stop offset="25%" stopColor="#FD5949" />
        <stop offset="60%" stopColor="#D6249F" />
        <stop offset="100%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill={muted ? "#B9BEC8" : "url(#ig-grad)"} />
    <circle cx="12" cy="12" r="4.6" fill="none" stroke="#fff" strokeWidth="2" />
    <circle cx="17.4" cy="6.6" r="1.3" fill="#fff" />
  </svg>
);

export const TikTokLogo = ({
  className = "h-6 w-6",
  muted = false,
}: {
  className?: string;
  muted?: boolean;
}) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      d="M15.8 4.2c.5 1.9 1.9 3.3 3.8 3.6v2.7c-1.4 0-2.8-.4-4-1.2v5.4a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.8a2.9 2.9 0 1 0 2 2.7V2.9h2.9c0 .4 0 .9 0 1.3z"
      fill={muted ? "#B9BEC8" : "#25F4EE"}
      transform="translate(-1.1 0.7)"
    />
    <path
      d="M15.8 4.2c.5 1.9 1.9 3.3 3.8 3.6v2.7c-1.4 0-2.8-.4-4-1.2v5.4a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.8a2.9 2.9 0 1 0 2 2.7V2.9h2.9c0 .4 0 .9 0 1.3z"
      fill={muted ? "#CBD0D8" : "#FE2C55"}
      transform="translate(0.9 -0.5)"
    />
    <path
      d="M15.8 4.2c.5 1.9 1.9 3.3 3.8 3.6v2.7c-1.4 0-2.8-.4-4-1.2v5.4a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.8a2.9 2.9 0 1 0 2 2.7V2.9h2.9c0 .4 0 .9 0 1.3z"
      fill={muted ? "#9AA1AD" : "#000000"}
    />
  </svg>
);

export const YouTubeLogo = ({
  className = "h-6 w-6",
  muted = false,
}: {
  className?: string;
  muted?: boolean;
}) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <rect x="1" y="4.5" width="22" height="15" rx="4.5" fill={muted ? "#B9BEC8" : "#FF0000"} />
    <path d="M10 8.8l6 3.2-6 3.2V8.8z" fill="#fff" />
  </svg>
);
