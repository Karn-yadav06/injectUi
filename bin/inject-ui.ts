#!/usr/bin/env node

/**
 * InjectUI Component Installer CLI
 * Usage: npx inject-ui add <component-slug>
 */

import fs from "fs";
import path from "path";
import http from "http";
import https from "https";

interface ComponentApiResponse {
  success?: boolean;
  isLocked?: boolean;
  message?: string;
  component?: {
    name: string;
    slug: string;
    access: "free" | "premium";
    sourceCode?: string;
    dependencies?: string[];
  };
}

interface FetchResult {
  status: number;
  data: ComponentApiResponse;
}

const args: string[] = process.argv.slice(2);
const command: string | undefined = args[0];
const componentSlug: string | undefined = args[1];

if (!command || command !== "add" || !componentSlug) {
  console.log(`
InjectUI CLI - Build Faster. Ship Better.

Usage:
  npx inject-ui add <component-name>

Examples:
  npx inject-ui add button
  npx inject-ui add modal
  npx inject-ui add data-table
`);
  process.exit(1);
}

// 1. Validate slug safety (reject path traversal, special symbols)
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
if (!SLUG_REGEX.test(componentSlug)) {
  console.error(`❌ Error: Invalid component name "${componentSlug}". Name must be lowercase alphanumeric with hyphens.`);
  process.exit(1);
}

const baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || process.env.INJECT_UI_URL || "http://localhost:3000";
const targetUrl: string = `${baseUrl}/api/components/${encodeURIComponent(componentSlug)}`;

console.log(`🚀 Fetching component "${componentSlug}" from ${baseUrl}...`);

function fetchJson(url: string): Promise<FetchResult> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk: Buffer | string) => (data += chunk.toString()));
        res.on("end", () => {
          try {
            const json: ComponentApiResponse = JSON.parse(data);
            resolve({ status: res.statusCode || 200, data: json });
          } catch {
            reject(new Error(`Failed to parse response from ${url}: ${data.substring(0, 100)}`));
          }
        });
      })
      .on("error", reject);
  });
}

export async function run(): Promise<void> {
  try {
    const { status, data } = await fetchJson(targetUrl);

    if (status === 404 || !data.component) {
      console.error(`❌ Component "${componentSlug}" not found in catalogue.`);
      process.exit(1);
    }

    if (data.isLocked || !data.component.sourceCode) {
      console.error(`🔒 Component "${componentSlug}" is a PREMIUM component.`);
      console.error(`   Please sign in with a premium account on InjectUI to access this component.`);
      process.exit(1);
    }

    const component = data.component;
    const destDir = path.resolve(process.cwd(), "components", "ui");

    // Path safety check: ensure destination is within current directory
    if (!destDir.startsWith(process.cwd())) {
      console.error("❌ Security error: Invalid destination path traversal detected.");
      process.exit(1);
    }

    // Ensure directory exists
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const filePath = path.join(destDir, `${componentSlug}.tsx`);

    // Prevent silent overwriting
    if (fs.existsSync(filePath) && !process.env.FORCE) {
      console.warn(`⚠️  File already exists: ${path.relative(process.cwd(), filePath)}`);
      console.warn(`   To overwrite, delete the existing file or set FORCE=true.`);
      process.exit(0);
    }

    // Write file securely (no shell execution!)
    fs.writeFileSync(filePath, component.sourceCode || "", "utf8");

    console.log(`✅ Successfully added ${component.name}!`);
    console.log(`📁 File created: ${path.relative(process.cwd(), filePath)}`);

    if (component.dependencies && component.dependencies.length > 0) {
      console.log(`\n📦 Required dependencies:`);
      console.log(`   npm install ${component.dependencies.join(" ")}`);
    }

    console.log(`\n🎉 Done! Ready to import from @/components/ui/${componentSlug}`);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("❌ Installation error:", errorMessage);
    process.exit(1);
  }
}

if (require.main === module || process.argv[1]?.endsWith("inject-ui.ts") || process.argv[1]?.endsWith("inject-ui.js")) {
  run();
}
