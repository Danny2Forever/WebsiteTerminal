"use client";

import { useState } from "react";

export default function RealTerminal() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([]); // TypeScript syntax here

  const runCommand = async () => {
    if (!input.trim()) return;

    const response = await fetch("/api/terminal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: input }),
    });

    const data = await response.json();
    setOutput((prev) => [...prev, `C:\\Users\\NextJS> ${input}`, data.output]);
    setInput("");
  };

  return (
    <div className="w-full h-[400px] bg-black text-white p-4 rounded-lg">
      <div className="h-[350px] overflow-y-auto">
        {output.map((line, index) => (
          <p key={index} className="text-green-400">{line}</p>
        ))}
      </div>
      <div className="flex items-center">
        <span className="text-white">C:\Users\NextJS&gt;</span>
        <input
          type="text"
          className="bg-black text-white outline-none ml-2 w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runCommand()}
        />
      </div>
    </div>
  );
}
