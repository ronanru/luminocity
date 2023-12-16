import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const ArrowLeftIcon = (props: ComponentProps<"svg">) => (
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
      d="M8.333 4.167 2.5 10m0 0 5.833 5.833M2.5 10h15"
    />
  </svg>
);
