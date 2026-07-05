const { app, BrowserWindow } = require("electron");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");

const isDev = process.env.GOHARTWIN_DEV === "1";
let backendProc = null;

function resourcesRoot() {
  if (app.isPackaged) {
    return process.resourcesPath;
  }
  return path.join(__dirname, "..");
}

function startBackend() {
  const root = resourcesRoot();
  const env = { ...process.env, GOHARTWIN_ROOT: root };

  if (isDev) {
    const python = path.join(root, "backend", ".venv", "Scripts", "python.exe");
    const mainPy = path.join(root, "backend", "main.py");
    if (!fs.existsSync(python)) {
      console.error("Python venv not found:", python);
      return;
    }
    backendProc = spawn(python, [mainPy], {
      cwd: root,
      env,
      windowsHide: true,
      stdio: "ignore",
    });
    return;
  }

  const apiExe = path.join(root, "backend", "gohartwin-api.exe");
  if (!fs.existsSync(apiExe)) {
    console.error("Bundled API not found:", apiExe);
    return;
  }
  backendProc = spawn(apiExe, [], {
    cwd: root,
    env,
    windowsHide: true,
    stdio: "ignore",
  });
}

function waitForBackend(timeoutMs = 45000) {
  return new Promise((resolve) => {
    const deadline = Date.now() + timeoutMs;

    const ping = () => {
      const req = http.get("http://127.0.0.1:8000/api/v1/health", (res) => {
        res.resume();
        if (res.statusCode === 200) {
          resolve(true);
          return;
        }
        retry();
      });
      req.on("error", retry);
      req.setTimeout(2000, () => {
        req.destroy();
        retry();
      });

      function retry() {
        if (Date.now() < deadline) {
          setTimeout(ping, 400);
        } else {
          resolve(false);
        }
      }
    };

    ping();
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    title: "GoharTwin",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  const url = isDev ? "http://127.0.0.1:5173" : "http://127.0.0.1:8000";
  win.loadURL(url);
  win.once("ready-to-show", () => win.show());
}

app.whenReady().then(async () => {
  startBackend();
  const ok = await waitForBackend();
  if (!ok) {
    console.error("GoharTwin backend did not become ready in time.");
  }
  createWindow();
});

app.on("window-all-closed", () => {
  if (backendProc) {
    backendProc.kill();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (backendProc) {
    backendProc.kill();
  }
});
