import { type ComponentProps } from "react";

export const HomeIcon = (props: ComponentProps<"svg">) => (
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
      d="M18.333 14.167v-3.713c0-1.355 0-2.033-.165-2.66a5.001 5.001 0 0 0-.818-1.702c-.387-.521-.916-.945-1.974-1.791l-.378-.303h0c-1.784-1.427-2.676-2.14-3.665-2.414a5 5 0 0 0-2.666 0c-.99.274-1.88.987-3.664 2.414h0l-.379.303c-1.058.846-1.587 1.27-1.974 1.79a5 5 0 0 0-.818 1.703c-.165.627-.165 1.305-.165 2.66v3.713a4.167 4.167 0 0 0 4.166 4.166c.92 0 1.667-.746 1.667-1.666v-3.334a2.5 2.5 0 0 1 5 0v3.334c0 .92.746 1.666 1.667 1.666a4.167 4.167 0 0 0 4.166-4.166Z"
    />
  </svg>
);
