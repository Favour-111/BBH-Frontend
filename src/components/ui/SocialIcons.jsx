export function InstagramIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function TiktokIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M16 3c.3 2.1 1.7 3.6 4 3.9v3c-1.4 0-2.7-.4-4-1.2v6.6c0 3.4-2.4 5.7-5.6 5.7A5.5 5.5 0 0 1 5 15.6c0-3 2.4-5.6 5.6-5.6.4 0 .8 0 1.2.1v3.1a2.7 2.7 0 0 0-1.2-.3 2.6 2.6 0 1 0 0 5.3c1.6 0 2.7-1.1 2.7-2.9V3h2.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function YoutubeIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.5 9.3v5.4l4.8-2.7-4.8-2.7Z" fill="currentColor" />
    </svg>
  );
}
