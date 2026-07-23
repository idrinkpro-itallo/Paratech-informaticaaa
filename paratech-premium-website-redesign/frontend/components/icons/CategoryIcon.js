const ICON_PATHS = {
  "laptops": (
    <>
      <rect x="4" y="4" width="16" height="10" rx="1.2" />
      <path d="M2 18h20l-1.5 2.2a1 1 0 0 1-.8.4H4.3a1 1 0 0 1-.8-.4L2 18Z" />
      <path d="M9.5 9.5h5" />
    </>
  ),
  "desktop-computers": (
    <>
      <rect x="6" y="3" width="9" height="18" rx="1.4" />
      <circle cx="10.5" cy="7" r="0.6" fill="currentColor" stroke="none" />
      <path d="M8.5 11h4M8.5 14h4" />
      <circle cx="10.5" cy="18" r="1.3" />
    </>
  ),
  "gaming": (
    <>
      <path d="M6.5 8h11a4 4 0 0 1 3.9 4.9l-.8 3.4a2.3 2.3 0 0 1-4-.9L16 14H8l-.6 1.4a2.3 2.3 0 0 1-4 .9l-.8-3.4A4 4 0 0 1 6.5 8Z" />
      <path d="M7.5 11v2.4M6.3 12.2h2.4" />
      <circle cx="15.2" cy="11" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="17.2" cy="13" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  "smartphones": (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
      <path d="M10.5 5.2h3" />
      <circle cx="12" cy="18.3" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  "printers": (
    <>
      <path d="M6 8V3.5h12V8" />
      <rect x="3.5" y="8" width="17" height="8" rx="1.4" />
      <path d="M6 15.5v5h12v-5" />
      <circle cx="17" cy="11.3" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  "networking": (
    <>
      <path d="M4 9a11 11 0 0 1 16 0" />
      <path d="M7 12.5a6.5 6.5 0 0 1 10 0" />
      <path d="M10 16a2.6 2.6 0 0 1 4 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  "ssd-storage": (
    <>
      <rect x="3.5" y="6" width="17" height="6" rx="1.3" />
      <rect x="3.5" y="13" width="17" height="6" rx="1.3" />
      <circle cx="7.5" cy="9" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="16" r="0.6" fill="currentColor" stroke="none" />
      <path d="M11.5 9h5M11.5 16h5" />
    </>
  ),
  "ram-memory": (
    <>
      <path d="M4 8h16v8.5a1 1 0 0 1-1 1H9l-1.5 2-1.5-2H5a1 1 0 0 1-1-1V8Z" />
      <path d="M7.5 8V5.5M11 8V5.5M14.5 8V5.5M18 8V5.5" />
    </>
  ),
  "monitors": (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.4" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  "accessories": (
    <>
      <path d="M12 3.5c3.6 0 6 2.9 6 6.8v4.4c0 3.5-2.4 5.8-6 5.8s-6-2.3-6-5.8v-4.4c0-3.9 2.4-6.8 6-6.8Z" />
      <path d="M12 3.5v6" />
    </>
  ),
  "audio": (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="13.5" width="4" height="6" rx="1.3" />
      <rect x="17" y="13.5" width="4" height="6" rx="1.3" />
    </>
  ),
  "security-cameras": (
    <>
      <path d="M3.5 8.5 13 6a1.5 1.5 0 0 1 2 1.4v6.2a1.5 1.5 0 0 1-2 1.4L3.5 12.3Z" />
      <path d="M13 9.5 20 7v8l-7-2.5" />
      <circle cx="7" cy="10.4" r="1.1" fill="currentColor" stroke="none" />
      <path d="M6 15.5c-1 1.2-1 3 0 4.5" />
    </>
  ),
  "cables": (
    <>
      <path d="M8 3v4a2 2 0 0 0 2 2h4a2 2 0 0 1 2 2v4" />
      <path d="M16 21v-4a2 2 0 0 0-2-2h-4a2 2 0 0 1-2-2V9" />
      <circle cx="8" cy="3" r="1.6" />
      <circle cx="16" cy="21" r="1.6" />
    </>
  ),
  "office-equipment": (
    <>
      <rect x="3" y="8" width="18" height="12" rx="1.6" />
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18M10.5 13v2M13.5 13v2" />
    </>
  ),
};

export default function CategoryIcon({ category, className = "pv-icon" }) {
  const path = ICON_PATHS[category];
  if (!path) return null;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
