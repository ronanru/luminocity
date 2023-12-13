import { type ComponentProps } from "react";

export const ArrowLeftIcon = (props: ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    {...props}
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
