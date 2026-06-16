export function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="applytrackr-logo-gradient" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#DBEAFE" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#applytrackr-logo-gradient)" />
      <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="none" stroke="#BFDBFE" strokeWidth="3" />
      <circle cx="36" cy="12" r="4.2" fill="#F59E0B" />
      <path d="M15 18.5C15 15.5 17.5 13 20.5 13h7c3 0 5.5 2.5 5.5 5.5V20h-4v-1.5c0-.8-.7-1.5-1.5-1.5h-7c-.8 0-1.5.7-1.5 1.5V20h-4v-1.5Z" fill="#1E3A8A" />
      <path d="M11 21h26c1.7 0 3 1.3 3 3v9c0 1.7-1.3 3-3 3H11c-1.7 0-3-1.3-3-3v-9c0-1.7 1.3-3 3-3Z" fill="#1D4ED8" />
      <path d="M18 29.3 22.1 33 31 23.8" fill="none" stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 26.5h32" stroke="#93C5FD" strokeWidth="1.8" />
    </svg>
  );
}
