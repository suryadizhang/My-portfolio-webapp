# VS Code Setup for Docker Validation

This guide shows how to run the Docker validation script directly from VS Code with one click.

## 🚀 Quick Setup

### Method 1: Command Palette (Easiest)
1. Press `Ctrl+Shift+P` to open Command Palette
2. Type: `Tasks: Run Task`
3. Select: `🐳 Validate Docker Build`

### Method 2: VS Code Tasks Configuration

Create or update `.vscode/tasks.json` in your workspace:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "🐳 Validate Docker Build",
      "type": "shell",
      "command": "powershell",
      "args": [
        "-ExecutionPolicy",
        "Bypass", 
        "-File",
        "${workspaceFolder}/scripts/ci/validate-docker-build.ps1"
      ],
      "group": {
        "kind": "build",
        "isDefault": false
      },
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new",
        "showReuseMessage": true,
        "clear": false
      },
      "problemMatcher": [],
      "detail": "Validates Docker build locally before pushing to CI/CD",
      "icon": {
        "id": "symbol-misc",
        "color": "terminal.ansiBlue"
      }
    }
  ]
}
```

### Method 3: Keyboard Shortcuts

Add to `.vscode/keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+d",
    "command": "workbench.action.tasks.runTask",
    "args": "🐳 Validate Docker Build",
    "when": "!inDebugMode"
  }
]
```

## 🎯 Available Tasks

| Task | Shortcut | Description |
|------|----------|-------------|
| 🐳 Validate Docker Build | `Ctrl+Shift+D` | Run Docker validation script |
| 🏗️ Build Next.js App | `Ctrl+Shift+B` | Build the Next.js app |
| 🚀 Pre-Push Validation | `Ctrl+Shift+Alt+D` | Complete validation pipeline |

## 📋 Usage Options

### Option 1: Task Runner
1. `Ctrl+Shift+P` → `Tasks: Run Task`
2. Select `🐳 Validate Docker Build`

### Option 2: Terminal Menu
1. `Terminal` → `Run Task...`
2. Select `🐳 Validate Docker Build`

### Option 3: Keyboard Shortcut
- Press `Ctrl+Shift+D` (if configured)

### Option 4: Status Bar
- Look for the task runner icon in status bar

## 🔧 Full Pre-Push Pipeline

For complete validation before pushing:

1. `Ctrl+Shift+P` → `Tasks: Run Task`
2. Select `🚀 Pre-Push Validation`

This runs:
- TypeScript type checking
- Tests across workspaces  
- Next.js build
- Docker validation

## 🐛 Troubleshooting

**PowerShell Execution Policy Error:**
- The task already includes `-ExecutionPolicy Bypass`

**Docker Not Running:**
- Start Docker Desktop before running validation

**Port 3001 Already in Use:**
- The script will fail gracefully and clean up

## 📁 Alternative: Manual Setup

If you prefer not to modify .vscode configs:

```bash
# Direct PowerShell execution
.\scripts\ci\validate-docker-build.ps1

# Or via VS Code terminal
powershell -ExecutionPolicy Bypass -File ".\scripts\ci\validate-docker-build.ps1"
```