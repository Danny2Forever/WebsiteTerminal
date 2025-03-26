# NextJS Website Terminal API
This is a Next.js app that allows users to run terminal commands via a web interface. The app sends commands to PowerShell on the server, processes them, and returns the output in real-time.

#  Features
- Execute PowerShell commands from the browser.
- Command output displayed in a terminal-like UI.
- IP-based authorization: Only trusted IPs can run commands.
- Real-time terminal updates using React's useState and useEffect.

# Limitations
Does not support SSH or other remote access protocols. This app only works on the server where it's hosted, running commands within the project directory.

#  Installation
Clone the repository:

```
git clone https://github.com/Danny2Forever/WebsiteTerminal.git
```

Install dependencies using pnpm:

```
cd webterminal
pnpm install
```
Run the development server:

```
pnpm dev
```

Access the terminal at http://localhost:3000.

# Project Structure
```
webterminal/
├── app/
│   ├── api/terminal/route.ts   # API for handling terminal commands
│   └── page.tsx                # Main page displaying the terminal
├── components/
│   └── RealTerminal.tsx        # Component for the terminal UI
├── package.json                # Project configuration
└── README.md                   # This README file
```

# Security
Only IPs in the allowedIPs array are allowed to execute commands. Be sure to configure this list based on your needs.

# Requirements
- Node.js v14 or higher
- pnpm (Recommended for faster installations)
