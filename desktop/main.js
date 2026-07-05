const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

const isDev = process.env.GOHARTWIN_DEV === "1";
const root = path.join(__dirname, "..");
const python = path.join(root, "backend", ".venv", "Scripts", "python.exe");
const mainPy = path.join(root, "backend", "main.py");

let backendProc = null;

function startBackend() {
  if (!require("fs").existsSync(python)) {
    console.error("Python venv not found:", python);
    return;
  }
  backendProc = spawn(python, [mainPy], {
    cwd: root,
    windowsHide: true,
    stdio: "ignore",
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  const url = isDev ? "http://127.0.0.1:5173" : `file://${path.join(root, "frontend", "dist", "index.html")}`;
  win.loadURL(url);
  win.once("ready-to-show", () => win.show());
}

app.whenReady().then(() => {
  startBackend();
  setTimeout(createWindow, isDev ? 500 : 2500);
});

app.on("window-all-closed", () => {
  if (backendProc) backendProc.kill();
  if (process.platform !== "darwin") app.quit();
});
