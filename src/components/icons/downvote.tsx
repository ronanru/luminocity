import { type ComponentProps } from "react";

export const DownvoteIcon = (props: ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    {...props}
  >
    <path
      d="M13.334 5.833 10 9.167 6.667 5.833m-3.333 2.5L10 15l6.667-6.667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
