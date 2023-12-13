import "@/styles/auth.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <main className="grid flex-1 place-items-center">{children}</main>;
}
