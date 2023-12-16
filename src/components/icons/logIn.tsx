import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const LogInIcon = (props: ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
    className={twMerge("w-5 h-5", props.className)}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M6.667 6.667V6.25v0c0-.542 0-.813.026-1.04a4 4 0 0 1 3.517-3.517c.227-.026.498-.026 1.04-.026h1.25c1.707 0 2.561 0 3.242.256a4 4 0 0 1 2.335 2.335c.256.68.256 1.535.256 3.242v5c0 1.707 0 2.561-.256 3.242a4 4 0 0 1-2.335 2.335c-.68.256-1.535.256-3.242.256h-1.25c-.542 0-.813 0-1.04-.026a4 4 0 0 1-3.517-3.516c-.026-.228-.026-.5-.026-1.041v0-.417m-5-3.333h12.5m0 0-3.334-3.333M14.167 10l-3.334 3.333"
    />
  </svg>
);
