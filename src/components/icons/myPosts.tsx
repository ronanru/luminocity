import { type ComponentProps } from "react";

export const MyPostsIcon = (props: ComponentProps<"svg">) => (
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
      d="M5.833 6.667H12.5M5.833 10h3.333m6.43 7.525v0c.403.242.605.362.759.414a1.5 1.5 0 0 0 1.943-1.1c.035-.16.035-.394.035-.863v-6.31c0-2.8 0-4.2-.545-5.27a5 5 0 0 0-2.185-2.184c-1.07-.545-2.47-.545-5.27-.545H9.166c-2.33 0-3.494 0-4.413.38a5 5 0 0 0-2.706 2.706c-.38.92-.38 2.084-.38 4.414v0c0 2.33 0 3.494.38 4.413a5 5 0 0 0 2.706 2.706c.919.38 2.084.38 4.413.38h3.332c.281 0 .422 0 .56.008a5 5 0 0 1 2.055.57c.123.064.243.136.484.28Z"
    />
  </svg>
);
