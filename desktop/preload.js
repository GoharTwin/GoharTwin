const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("gohartwin", {
  version: "0.3.0",
  platform: "desktop",
});
