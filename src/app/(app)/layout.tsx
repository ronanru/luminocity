import { Navigation } from "./navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-1 mx-auto max-w-[648px] w-full p-6">
        {children}
      </main>
      <Navigation />
    </>
  );
}
