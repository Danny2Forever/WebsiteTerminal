"use client";

import RealTerminal from "@/components/RealTerminal";

export default function Home() {
  return (
    <main className="flex justify-center items-center h-screen bg-gray-900">
      <div className="w-3/4">
        <RealTerminal />
      </div>
    </main>
  );
}
