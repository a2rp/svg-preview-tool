export const sampleSvgs = [
    {
        name: "Orbit mark",
        detail: "Layered circles and a bright orbital path",
        markup: `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400" fill="none">
  <defs>
    <linearGradient id="orb" x1="146" y1="68" x2="485" y2="342" gradientUnits="userSpaceOnUse">
      <stop stop-color="#B3DF4C"/>
      <stop offset="1" stop-color="#56A886"/>
    </linearGradient>
  </defs>
  <rect width="640" height="400" rx="36" fill="#18201B"/>
  <circle cx="320" cy="200" r="119" stroke="#F4F4EC" stroke-opacity=".14" stroke-width="2"/>
  <circle cx="320" cy="200" r="79" stroke="#F4F4EC" stroke-opacity=".18" stroke-width="2"/>
  <ellipse cx="320" cy="200" rx="160" ry="70" transform="rotate(-24 320 200)" stroke="url(#orb)" stroke-width="4"/>
  <circle cx="442" cy="133" r="11" fill="#B3DF4C"/>
  <circle cx="320" cy="200" r="37" fill="url(#orb)"/>
  <circle cx="320" cy="200" r="13" fill="#18201B"/>
</svg>`,
    },
    {
        name: "Signal study",
        detail: "An even rhythm of editable vector lines",
        markup: `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400" fill="none">
  <rect width="640" height="400" rx="36" fill="#F1F2ED"/>
  <path d="M160 200h28l19-61 42 123 41-123 42 123 41-123 42 61h67" stroke="#1F2924" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="160" cy="200" r="9" fill="#B3DF4C"/>
  <circle cx="480" cy="200" r="9" fill="#B3DF4C"/>
</svg>`,
    },
    {
        name: "Soft geometry",
        detail: "A bright shape with a compact viewBox",
        markup: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="112" fill="#B3DF4C"/>
  <path d="M151 161h210v190H151z" stroke="#1F2924" stroke-width="17"/>
  <path d="m187 307 53-73 43 59 32-41 34 55H187Z" fill="#1F2924"/>
  <circle cx="327" cy="207" r="17" fill="#1F2924"/>
</svg>`,
    },
];
