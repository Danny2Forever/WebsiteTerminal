"use client";

import { useState, useRef, useEffect } from "react";

export default function RealTerminal() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Ref for input field

  useEffect(() => {
    const fetchCurrentPath = async () => {
      const response = await fetch("/api/terminal");
      const data = await response.json();
      if (data?.currentDir) {
        setCurrentPath(data.currentDir);
      }
    };
    fetchCurrentPath();
  }, []);

  const runCommand = async () => {
    if (!input.trim() || loading) return;

    setHistory((prev) => [...prev, input]); // Store command in history
    setHistoryIndex(null); // Reset history index
    setInput("");
    setLoading(true);
    setOutput((prev) => [...prev, `${currentPath}> ${input}`, "Running..."]);

    const response = await fetch("/api/terminal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: input }),
    });

    const data = await response.json();
    if (data?.output) {
      if (input.startsWith("cd ")) {
        if (data.output.startsWith("ENOENT:")) {
          setOutput((prev) => prev.slice(0, -1).concat(`${data.output}`));
        } else {
          setCurrentPath(data.output.replace("Changed directory to ", ""));
          setOutput((prev) => prev.slice(0, -1).concat(data.output));
        }
      } else {
        setOutput((prev) => prev.slice(0, -1).concat(data.output));
      }
    }
    setLoading(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        setHistoryIndex((prev) => {
          const newIndex =
            prev === null ? history.length - 1 : Math.max(prev - 1, 0);
          setInput(history[newIndex]);
          return newIndex;
        });
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length > 0 && historyIndex !== null) {
        setHistoryIndex((prev) => {
          if (prev === null) return null;
          const newIndex = Math.min(prev + 1, history.length - 1);
          setInput(history[newIndex] || "");
          return newIndex < history.length ? newIndex : null;
        });
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      outputContainerRef.current?.scrollTo({
        top: outputContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  }, [output]);

  return (
    <div className="w-full h-[400px] bg-black text-white p-4 rounded-lg">
      <div
        ref={outputContainerRef}
        className="h-[350px] overflow-y-auto overflow-x-hidden px-2"
      >
        <pre>
          {output.map((line, index) => (
            <p key={index} className="text-green-400">
              {line}
            </p>
          ))}
        </pre>
      </div>
      <div className="flex items-center">
        <span className="text-white">{currentPath}&gt;</span>
        <input
          ref={inputRef} // Attach ref to input field
          type="text"
          className="bg-black text-white outline-none ml-2 w-full"
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus // Automatically focus input on render
        />
      </div>
    </div>
  );
}
