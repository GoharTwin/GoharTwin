/**
 * Sync branding assets from the single source of truth: logo/logo.png
 * Run automatically before dev/build via npm predev/prebuild hooks.
 */
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "logo", "logo.png");

if (!fs.existsSync(source)) {
  console.error("[sync-branding] Missing source of truth: logo/logo.png");
  process.exit(1);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copy(dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(source, dest);
  console.log(`[sync-branding] → ${path.relative(root, dest)}`);
}

const publicRoot = path.join(root, "frontend", "public");
const iconSizes = [
  { name: "favicon.png", size: 32 },
  { name: path.join("icons", "icon-192.png"), size: 192 },
  { name: path.join("icons", "icon-512.png"), size: 512 },
  { name: path.join("icons", "apple-touch-icon.png"), size: 180 },
  { name: path.join("icons", "icon-144.png"), size: 144 },
  { name: path.join("icons", "icon-96.png"), size: 96 },
  { name: path.join("icons", "icon-72.png"), size: 72 },
  { name: path.join("icons", "icon-48.png"), size: 48 },
];

copy(path.join(publicRoot, "logo", "logo.png"));
copy(path.join(root, "assets", "branding", "logo.png"));

let sharp;
try {
  const require = createRequire(path.join(root, "frontend", "package.json"));
  sharp = require("sharp");
} catch {
  sharp = null;
}

if (sharp) {
  const input = sharp(source);
  for (const { name, size } of iconSizes) {
    const dest = path.join(publicRoot, name);
    ensureDir(path.dirname(dest));
    await input.clone().resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toFile(dest);
    console.log(`[sync-branding] → ${path.relative(root, dest)} (${size}px)`);
  }
} else {
  console.warn("[sync-branding] sharp not installed — copying same PNG for all icon sizes");
  for (const { name } of iconSizes) {
    copy(path.join(publicRoot, name));
  }
}

const manifest = {
  name: "GoharTwin",
  short_name: "GoharTwin",
  description: "Industrial Digital Twin Platform",
  start_url: "/",
  display: "standalone",
  background_color: "#0a0e17",
  theme_color: "#1e63b0",
  icons: [
    { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
};

fs.writeFileSync(
  path.join(publicRoot, "manifest.webmanifest"),
  JSON.stringify(manifest, null, 2),
  "utf8"
);
console.log("[sync-branding] → frontend/public/manifest.webmanifest");
console.log("[sync-branding] Done.");
