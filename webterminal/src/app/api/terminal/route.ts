import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import os from "os";

const allowedIPs: string[] = ["::1"];
let workingDirectory: string = os.homedir(); // Start at home directory

export async function GET(): Promise<Response> {
  return NextResponse.json({ currentDir: workingDirectory });
}

export async function POST(req: Request): Promise<Response> {
  const { command }: { command: string } = await req.json();
  const ip: string = req.headers.get("x-forwarded-for") || "Unknown IP";

  if (!ip || !allowedIPs.includes(ip)) {
    return NextResponse.json(
      { error: "Access denied: Unauthorized IP" },
      { status: 401 }
    );
  }

  if (!command) {
    return NextResponse.json({ error: "No command provided" }, { status: 400 });
  }

  if (command.startsWith("cd ")) {
    const newPath: string = command.slice(3).trim();
    const absolutePath: string = path.resolve(workingDirectory, newPath);

    try {
      process.chdir(absolutePath);
      workingDirectory = absolutePath;
      return NextResponse.json({
        output: `Changed directory to ${absolutePath}`,
      });
    } catch (error: any) {
      return NextResponse.json({ output: `${error.message}` });
    }
  }

  return new Promise((resolve) => {
    const process = spawn("powershell.exe", ["-Command", command], {
      cwd: workingDirectory,
    });

    let output: string = "";
    let errorOutput: string = "";

    process.stdout.on("data", (data: Buffer) => {
      output += data.toString();
    });

    process.stderr.on("data", (data: Buffer) => {
      errorOutput += data.toString();
    });

    process.on("close", () => {
      resolve(
        NextResponse.json({
          output: (output + errorOutput).trim(),
          currentDir: workingDirectory,
        })
      );
    });
  });
}
