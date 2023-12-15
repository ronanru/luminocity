import { type ComponentProps } from "react";

export const UpvoteIcon = (props: ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    {...props}
  >
    <path
      d="M3.333 11.667 10 5l6.667 6.667m-10 2.5L10 10.833l3.334 3.334"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
