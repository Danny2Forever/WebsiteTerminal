import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(req: Request) {
  const { command } = await req.json();

  if (!command) {
    return NextResponse.json({ error: "No command provided" }, { status: 400 });
  }

  return new Promise((resolve) => {
    // Spawn PowerShell process
    const process = spawn("powershell.exe", ["-Command", command]);

    let output = "";
    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      output += data.toString();
    });

    process.on("close", () => {
      resolve(NextResponse.json({ output }));
    });
  });
}
