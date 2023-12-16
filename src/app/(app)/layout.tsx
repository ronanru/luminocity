import { Navigation } from "./navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-full overflow-y-auto flex-1">
        <main className="mx-auto max-w-[648px] w-full p-6">{children}</main>
      </div>
      <Navigation />
    </>
  );
}
