export const sampleSvgs = [
    {
        name: "Orbit mark",
        detail: "Layered circles and a bright orbital path",
        markup: `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400" fill="none">
  <defs>
    <linearGradient id="orb" x1="146" y1="68" x2="485" y2="342" gradientUnits="userSpaceOnUse">
      <stop stop-color="#57D0BB"/>
      <stop offset="1" stop-color="#4D7CD6"/>
    </linearGradient>
  </defs>
  <rect width="640" height="400" rx="36" fill="#182326"/>
  <circle cx="320" cy="200" r="119" stroke="#F4F6F5" stroke-opacity=".14" stroke-width="2"/>
  <circle cx="320" cy="200" r="79" stroke="#F4F6F5" stroke-opacity=".18" stroke-width="2"/>
  <ellipse cx="320" cy="200" rx="160" ry="70" transform="rotate(-24 320 200)" stroke="url(#orb)" stroke-width="4"/>
  <circle cx="442" cy="133" r="11" fill="#57D0BB"/>
  <circle cx="320" cy="200" r="37" fill="url(#orb)"/>
  <circle cx="320" cy="200" r="13" fill="#182326"/>
</svg>`,
    },
    {
        name: "Signal study",
        detail: "An even rhythm of editable vector lines",
        markup: `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400" fill="none">
  <rect width="640" height="400" rx="36" fill="#EEF3F2"/>
  <path d="M160 200h28l19-61 42 123 41-123 42 123 41-123 42 61h67" stroke="#202A2D" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="160" cy="200" r="9" fill="#57D0BB"/>
  <circle cx="480" cy="200" r="9" fill="#57D0BB"/>
</svg>`,
    },
    {
        name: "Soft geometry",
        detail: "A bright shape with a compact viewBox",
        markup: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="112" fill="#57D0BB"/>
  <path d="M151 161h210v190H151z" stroke="#202A2D" stroke-width="17"/>
  <path d="m187 307 53-73 43 59 32-41 34 55H187Z" fill="#202A2D"/>
  <circle cx="327" cy="207" r="17" fill="#202A2D"/>
</svg>`,
    },
];
