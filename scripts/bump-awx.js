#!/usr/bin/env node
/**
 * Update all SKILL.md files to use the latest @agentwallex/cli version from npm.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SKILLS_DIR = path.join(__dirname, "..", "skills");
const PKG = "@agentwallex/cli";

// Get latest version from npm
const latest = execSync(`npm view ${PKG} version`, { encoding: "utf-8" }).trim();
console.log(`Latest ${PKG} version: ${latest}`);

// Find all SKILL.md files
const dirs = fs.readdirSync(SKILLS_DIR).filter((d) =>
  fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
);

let updated = 0;
for (const dir of dirs) {
  const file = path.join(SKILLS_DIR, dir, "SKILL.md");
  if (!fs.existsSync(file)) continue;

  let content = fs.readFileSync(file, "utf-8");
  const regex = new RegExp(`${PKG.replace("/", "\\/")}@[\\d.]+`, "g");
  const matches = content.match(regex);
  if (!matches) continue;

  const newContent = content.replace(regex, `${PKG}@${latest}`);
  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    console.log(`  Updated ${dir}/SKILL.md (${matches.length} occurrences)`);
    updated++;
  }
}

console.log(`\nDone. Updated ${updated}/${dirs.length} skill files.`);
