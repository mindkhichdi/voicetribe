export default function VoiceTribeLogo() {
  return (
    <svg
      width="200"
      height="48"
      viewBox="0 0 200 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="VoiceTribe Logo"
    >
      {/* Sound Wave Icon */}
      <path
        d="M24 12v24M16 18v12M8 22v4M32 18v12M40 22v4"
        stroke="#8B5CF6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Text "VoiceTribe" */}
      <text
        x="56"
        y="32"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="24"
        fontWeight="600"
        fill="#8B5CF6"
      >
        VoiceTribe
      </text>
    </svg>
  );
}