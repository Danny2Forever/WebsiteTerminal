"use client";

import { useState, useRef, useEffect } from "react";

export default function RealTerminal() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const outputContainerRef = useRef<HTMLDivElement>(null);

  const runCommand = async () => {
    if (!input.trim() || loading) return;
    setInput("");
    setLoading(true);
    setOutput((prev) => [...prev, `C:\\Users\\NextJS> ${input}`, "Running..."]);
    const response = await fetch("/api/terminal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: input }),
    });

    const data = await response.json();
    setOutput((prev) => prev.slice(0, -1).concat(data.output));
    setLoading(false);
    
  };

  useEffect(() => {
    setTimeout(() => {
      outputContainerRef.current?.scrollTo({
        top: outputContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100); // Small delay to ensure DOM updates
  }, [output]);

  return (
    <div className="w-full h-[400px] bg-black text-white p-4 rounded-lg">
      <div
        ref={outputContainerRef}
        className="h-[350px] overflow-y-auto overflow-x-hidden px-2"
      >
        <pre>
          {output.map((line, index) => (
            <p key={index} className="text-green-400">{line}</p>
          ))}
        </pre>
      </div>
      <div className="flex items-center">
        <span className="text-white">C:\Users\NextJS&gt;</span>
        <input
          type="text"
          className="bg-black text-white outline-none ml-2 w-full"
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runCommand()}
        />
      </div>
    </div>
  );
}
