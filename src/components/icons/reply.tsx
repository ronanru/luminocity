import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const ReplyIcon = (props: ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
    className={twMerge("w-5 h-5", props.className)}
  >
    <path
      d="M1.333 7.333c0-.929 0-1.393.062-1.782A5 5 0 0 1 5.55 1.395c.388-.062.853-.062 1.782-.062H8c1.55 0 2.325 0 2.96.17a5 5 0 0 1 3.536 3.536c.17.636.17 1.411.17 2.961v4.78a1.445 1.445 0 0 1-2.189 1.24v0A4.818 4.818 0 0 0 10 13.333H7.333c-.929 0-1.394 0-1.782-.061a5 5 0 0 1-4.156-4.156c-.062-.39-.062-.854-.062-1.783v0Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
