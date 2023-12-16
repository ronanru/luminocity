import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const UpvoteIcon = (props: ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
    className={twMerge("w-5 h-5", props.className)}
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
