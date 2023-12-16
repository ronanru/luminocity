import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const DownvoteIcon = (props: ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
    className={twMerge("w-5 h-5", props.className)}
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
