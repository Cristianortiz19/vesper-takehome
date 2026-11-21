// Stroke icons from the Figma "Icons" section: 24 px grid, 2.25 stroke, round joins.
// Color follows currentColor, so text-* utilities tint them.

import type { SVGProps } from "react";

const paths = {
  home: <path d="M4 11 L12 4 L20 11 V20 H4 Z" />,
  progress: <path d="M6 19 V12 M12 19 V5 M18 19 V9" />,
  community: (
    <>
      <path d="M4 6.5 A2.5 2.5 0 0 1 6.5 4 H15.5 A2.5 2.5 0 0 1 18 6.5 V11.5 A2.5 2.5 0 0 1 15.5 14 H9 L5 17.5 V13.6 A2.5 2.5 0 0 1 4 11.5 Z" />
      <path d="M21 9.5 V15 A2.5 2.5 0 0 1 20 17 V20 L16.5 17.5 H11.5" />
    </>
  ),
  plan: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M4 10 H20 M9 3 V7 M15 3 V7" />
    </>
  ),
  heart: <path d="M12 20 C5 15 3 11 5.5 8 C7.5 5.6 10.5 6.2 12 8.5 C13.5 6.2 16.5 5.6 18.5 8 C21 11 19 15 12 20 Z" />,
  plus: <path d="M5 12 H19 M12 5 V19" />,
  minus: <path d="M5 12 H19" />,
  check: <path d="M5 12.5 L10 17 L19 7" />,
  close: <path d="M6 6 L18 18 M18 6 L6 18" />,
  "chevron-right": <path d="M9 6 L15 12 L9 18" />,
  shield: (
    <>
      <path d="M12 3 L19 6 V11 C19 15.5 16 19 12 21 C8 19 5 15.5 5 11 V6 Z" />
      <path d="M9 12 L11 14 L15 10" />
    </>
  ),
  sparkle: <path d="M12 4 L13.6 10.4 L20 12 L13.6 13.6 L12 20 L10.4 13.6 L4 12 L10.4 10.4 Z" />,
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
