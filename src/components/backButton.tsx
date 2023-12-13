import Link from "next/link";
import { ArrowLeftIcon } from "./icons/arrowLeft";

export const BackButton = ({ text, href }: { text: string; href: string }) => (
  <Link
    href={href}
    className="flex hover:underline items-center gap-4 text-gray-800 font-medium transition-colors text-sm group hover:text-gray-900"
  >
    <span className="group-hover:-translate-x-2 transition-transform">
      <ArrowLeftIcon />
    </span>
    {text}
  </Link>
);
