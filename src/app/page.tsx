import { Suspense } from "react";

import { Dashboard } from "@/components/dashboard/Dashboard";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 grid-bg" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12 sm:px-10 lg:px-16">
        <Suspense fallback={null}>
          <Dashboard />
        </Suspense>
      </div>
    </main>
  );
}
