import { NextResponse } from "next/server";
import { spawn } from "child_process";

const allowedIPs = ["::1"];
export async function POST(req: Request) {
  const { command } = await req.json();
  const ip = req.headers.get("x-forwarded-for") || "Unknown IP";

  // console.log(command)
  console.log(ip)
  // console.log(req)

  if (!ip || !allowedIPs.includes(ip)) {
    return NextResponse.json(
      { error: "Access denied: Unauthorized IP" },
      { status: 401 }
    );
  }

  if (!command) {
    return NextResponse.json({ error: "No command provided" }, { status: 400 });
  }

  return new Promise((resolve) => {
    // Spawn PowerShell process
    // const process = spawn("powershell.exe", [
    //   "-Command",
    //   `
    //   $admin = [System.Security.Principal.WindowsPrincipal][System.Security.Principal.WindowsIdentity]::GetCurrent()
    //   if (-not $admin.IsInRole([System.Security.Principal.WindowsBuiltInRole]::Administrator)) {
    //       Write-Output "Permission Denied: Admin rights required"
    //       exit
    //   }
    //   Stop-Computer -Force
    //   `,
    // ]); // Admin permission if don't mind the permission (not recommend) use spawn("powershell.exe", ["-Command", command])

    const process = spawn("powershell.exe", ["-Command", command]);

    let output = "";
    let errorOutput = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      output += data.toString();
    });

    process.on("close", () => {
      resolve(
        NextResponse.json({
          output: (output + errorOutput + "\n").trim(),
        })
      );
    });
    
  });
}
