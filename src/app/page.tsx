import { Suspense } from "react";

import { Dashboard } from "@/components/dashboard/Dashboard";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 grid-bg" />
      <div className="page-fade-top" />
      <div className="page-shell flex flex-col">
        <Suspense fallback={null}>
          <Dashboard />
        </Suspense>
      </div>
    </main>
  );
}
